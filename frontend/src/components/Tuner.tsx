import { motion, AnimatePresence } from 'framer-motion'
import { TunerResult } from '../hooks/useAudioCapture'

interface Props {
  result: TunerResult | null
  isListening: boolean
}

function TunerGauge({ cents, inTune }: { cents: number; inTune: boolean }) {
  const clampedCents = Math.max(-50, Math.min(50, cents))
  const angle = (clampedCents / 50) * 75

  const needleColor = inTune ? '#4ade80' : cents > 0 ? '#f87171' : '#22d3ee'
  const glowColor   = inTune ? 'rgba(74,222,128,0.4)' : cents > 0 ? 'rgba(248,113,113,0.4)' : 'rgba(34,211,238,0.4)'

  const cx = 120
  const cy = 120
  const r  = 90

  const toRad  = (deg: number) => ((deg - 90) * Math.PI) / 180
  const arcPath = (start: number, end: number) => {
    const s  = toRad(start)
    const e  = toRad(end)
    const x1 = cx + r * Math.cos(s)
    const y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e)
    const y2 = cy + r * Math.sin(e)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }

  const needleAngle = toRad(angle)
  const needleX     = cx + 80 * Math.cos(needleAngle)
  const needleY     = cy + 80 * Math.sin(needleAngle)

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-xs mx-auto overflow-visible">
      <defs>
        <filter id="needle-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path d={arcPath(-75, 75)} fill="none" stroke="#1c1c2e" strokeWidth="10" strokeLinecap="round" />

      {/* Flat zone */}
      <path d={arcPath(-75, -12)} fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" opacity="0.35" />
      {/* Sharp zone */}
      <path d={arcPath(12, 75)} fill="none" stroke="#f87171" strokeWidth="8" strokeLinecap="round" opacity="0.35" />
      {/* In-tune zone */}
      <path d={arcPath(-12, 12)} fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.7" />

      {/* Tick marks */}
      {[-75, -37.5, 0, 37.5, 75].map((a) => {
        const rad = toRad(a)
        const ox  = cx + 98  * Math.cos(rad)
        const oy  = cy + 98  * Math.sin(rad)
        const ix  = cx + 84  * Math.cos(rad)
        const iy  = cy + 84  * Math.sin(rad)
        return (
          <line
            key={a}
            x1={ix} y1={iy} x2={ox} y2={oy}
            stroke={a === 0 ? '#4ade80' : '#2a2a3a'}
            strokeWidth={a === 0 ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        )
      })}

      {/* Labels */}
      <text x="16"  y="142" fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="bold">♭</text>
      <text x="120" y="25"  fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">♩</text>
      <text x="224" y="142" fill="#f87171" fontSize="11" textAnchor="middle" fontWeight="bold">♯</text>

      {/* Needle glow */}
      <line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke={glowColor}
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transition: 'all 0.12s ease', filter: 'blur(6px)' }}
      />

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke={needleColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#needle-glow)"
        style={{ transition: 'all 0.12s ease' }}
      />

      {/* Pivot */}
      <circle cx={cx} cy={cy} r="7" fill="#0e0e1c" stroke="#1c1c2e" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="4" fill={needleColor} style={{ transition: 'fill 0.12s ease' }} />
    </svg>
  )
}

const STRING_NAMES = ['', 'e · 1st', 'B · 2nd', 'G · 3rd', 'D · 4th', 'A · 5th', 'E · 6th']

export default function Tuner({ result, isListening }: Props) {
  const hasSignal = !!(result?.signal && isListening)
  const inTune    = hasSignal && !!result?.in_tune
  const cents     = hasSignal ? result!.cents : 0

  return (
    <div className="glass rounded-3xl p-7 border border-border/60 flex flex-col items-center gap-6">
      {/* Note display */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={hasSignal ? result!.note : '--'}
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`text-9xl font-black tracking-tight leading-none ${
              !hasSignal ? 'text-gray-700' : inTune ? 'text-green-400' : 'text-white'
            }`}
            style={inTune ? { textShadow: '0 0 40px rgba(74,222,128,0.4)' } : undefined}
          >
            {hasSignal ? result!.note : '--'}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {hasSignal && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-sm mt-2 font-mono"
            >
              {result!.octave && `Oct. ${result!.octave}`}
              {result!.frequency > 0 && ` · ${result!.frequency.toFixed(1)} Hz`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gauge */}
      <div className="w-full">
        <TunerGauge cents={cents} inTune={inTune} />
      </div>

      {/* Cents readout */}
      <motion.div
        key={hasSignal ? (inTune ? 'tune' : cents) : 'idle'}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-2xl font-mono font-bold tracking-tight ${
          !hasSignal ? 'text-gray-700' : inTune ? 'text-green-400' : cents > 0 ? 'text-red-400' : 'text-cyan-400'
        }`}
      >
        {hasSignal
          ? inTune
            ? '✓ In Tune'
            : `${cents > 0 ? '+' : ''}${cents} cents`
          : isListening
          ? 'Play a note...'
          : 'Not listening'}
      </motion.div>

      {/* String indicator */}
      <AnimatePresence>
        {hasSignal && result!.string_num > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-6 py-3 text-center"
          >
            <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 font-semibold">
              Nearest String
            </div>
            <div className="text-amber-300 font-bold text-sm">{STRING_NAMES[result!.string_num]}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic status */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-700'
          }`}
        />
        <span className="text-gray-500 text-xs">
          {isListening ? 'Microphone active' : 'Click Start to listen'}
        </span>
      </div>
    </div>
  )
}
