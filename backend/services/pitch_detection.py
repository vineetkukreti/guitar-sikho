"""
Real-time pitch detection using the YIN algorithm (pure numpy).
Returns note name, octave, string, and cents deviation from reference pitch.
"""
import numpy as np
import struct

# Standard guitar tuning (string number → note + frequency)
GUITAR_STRINGS = [
    {"string": 1, "name": "e", "note": "E", "octave": 4, "freq": 329.63},
    {"string": 2, "name": "B", "note": "B", "octave": 3, "freq": 246.94},
    {"string": 3, "name": "G", "note": "G", "octave": 3, "freq": 196.00},
    {"string": 4, "name": "D", "note": "D", "octave": 3, "freq": 146.83},
    {"string": 5, "name": "A", "note": "A", "octave": 2, "freq": 110.00},
    {"string": 6, "name": "E", "note": "E", "octave": 2, "freq": 82.41},
]

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
A4_FREQ = 440.0


def yin_pitch(audio: np.ndarray, sample_rate: int = 44100, threshold: float = 0.15) -> float:
    """YIN algorithm — returns detected frequency in Hz, or 0 if no clear pitch."""
    N = len(audio)
    if N < 2:
        return 0.0

    max_lag = N // 2
    d = np.zeros(max_lag)

    # Difference function
    for tau in range(1, max_lag):
        diff = audio[:max_lag] - audio[tau: tau + max_lag]
        d[tau] = np.sum(diff ** 2)

    # Cumulative mean normalized difference
    cmnd = np.zeros(max_lag)
    cmnd[0] = 1.0
    running_sum = 0.0
    for tau in range(1, max_lag):
        running_sum += d[tau]
        if running_sum == 0:
            cmnd[tau] = 1.0
        else:
            cmnd[tau] = d[tau] * tau / running_sum

    # Find first minimum below threshold
    tau = 2
    while tau < max_lag - 1:
        if cmnd[tau] < threshold:
            while tau + 1 < max_lag - 1 and cmnd[tau + 1] < cmnd[tau]:
                tau += 1
            # Parabolic interpolation
            if tau > 0 and tau < max_lag - 1:
                s0, s1, s2 = cmnd[tau - 1], cmnd[tau], cmnd[tau + 1]
                denom = s0 - 2 * s1 + s2
                if denom != 0:
                    tau += 0.5 * (s0 - s2) / denom
            return sample_rate / tau
        tau += 1

    return 0.0


def freq_to_note(freq: float) -> dict:
    """Convert frequency to note name, octave, and cents deviation."""
    if freq <= 0:
        return {"note": "--", "octave": 0, "cents": 0, "midi": 0}

    midi = 69 + 12 * np.log2(freq / A4_FREQ)
    midi_rounded = round(midi)
    cents = round((midi - midi_rounded) * 100)

    note_idx = int(midi_rounded) % 12
    octave = (int(midi_rounded) - 12) // 12

    return {
        "note": NOTE_NAMES[note_idx],
        "octave": octave,
        "cents": int(cents),
        "midi": int(midi_rounded),
    }


def find_nearest_string(freq: float) -> dict:
    """Find which guitar string this note is closest to."""
    if freq <= 0:
        return GUITAR_STRINGS[0]

    best = min(GUITAR_STRINGS, key=lambda s: abs(np.log2(freq / s["freq"])))
    return best


def decode_audio_bytes(raw: bytes) -> np.ndarray:
    """Decode raw PCM float32 bytes from the browser into a numpy array."""
    count = len(raw) // 4
    audio = np.array(struct.unpack(f"{count}f", raw[:count * 4]), dtype=np.float32)
    return audio


def analyze_audio(raw_bytes: bytes, sample_rate: int = 44100) -> dict:
    """Full pipeline: bytes → pitch → note → string → tuning result."""
    audio = decode_audio_bytes(raw_bytes)

    if len(audio) < 512:
        return {"frequency": 0, "note": "--", "octave": 0, "cents": 0,
                "string": "?", "string_num": 0, "in_tune": False, "signal": False}

    # Normalize
    peak = np.max(np.abs(audio))
    if peak < 0.01:
        return {"frequency": 0, "note": "--", "octave": 0, "cents": 0,
                "string": "?", "string_num": 0, "in_tune": False, "signal": False}

    audio = audio / peak

    freq = yin_pitch(audio, sample_rate)
    note_info = freq_to_note(freq)
    nearest = find_nearest_string(freq)

    in_tune = abs(note_info["cents"]) <= 5 and freq > 0

    return {
        "frequency": round(freq, 2),
        "note": note_info["note"],
        "octave": note_info["octave"],
        "cents": note_info["cents"],
        "string": nearest["name"],
        "string_num": nearest["string"],
        "in_tune": in_tune,
        "signal": True,
    }
