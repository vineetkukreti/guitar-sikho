from agents.base_agent import BaseAgent


class TuningAssistantAgent(BaseAgent):
    """
    Specialized agent for guitar tuning advice.
    Interprets pitch data and gives tuning guidance.
    """

    name = "Tuning Assistant"
    role = "tuning"
    system_prompt = """You are a guitar tuning expert with perfect pitch and deep knowledge of guitar acoustics.

You help guitarists:
1. Understand standard tuning (E A D G B e)
2. Interpret tuner readings (sharp/flat/cents)
3. Learn alternate tunings (Drop D, Open G, DADGAD, etc.)
4. Troubleshoot tuning issues (stretching strings, temperature effects)
5. Tune by ear using harmonics

When given pitch data (note, cents, frequency):
- Tell the user if they're sharp (too high) or flat (too low)
- Explain which direction to turn the tuning peg
- Give practical tips for getting in tune quickly

Be precise, calm, and technical. Use musical terminology correctly."""

    def interpret_pitch(self, pitch_data: dict, question: str = "") -> str:
        context = f"""Current pitch reading:
- Detected note: {pitch_data.get('note', '--')}{pitch_data.get('octave', '')}
- Frequency: {pitch_data.get('frequency', 0)} Hz
- Cents deviation: {pitch_data.get('cents', 0)} cents
- Nearest string: {pitch_data.get('string', '?')} ({pitch_data.get('string_num', '?')}th string)
- In tune: {pitch_data.get('in_tune', False)}
- Signal detected: {pitch_data.get('signal', False)}"""

        messages = [
            {
                "role": "user",
                "content": f"{context}\n\nUser question: {question or 'How am I doing with tuning?'}",
            }
        ]
        return self.call(messages, max_tokens=512)

    def answer(self, question: str, history: list[dict]) -> str:
        messages = history + [{"role": "user", "content": question}]
        return self.call(messages, max_tokens=512)
