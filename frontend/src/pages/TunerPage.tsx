import { useAudioCapture } from '../hooks/useAudioCapture'
import TunerComponent from '../components/Tuner'
import { motion, AnimatePresence } from 'framer-motion'

const STRINGS = [
  { num: 6, note: 'E2', freq: '82.41 Hz', label: '6th · Low E' },
  { num: 5, note: 'A2', freq: '110.00 Hz', label: '5th · A' },
  { num: 4, note: 'D3', freq: '146.83 Hz', label: '4th · D' },
  { num: 3, note: 'G3', freq: '196.00 Hz', label: '3rd · G' },
  { num: 2, note: 'B3', freq: '246.94 Hz', label: '2nd · B' },
  { num: 1, note: 'E4', freq: '329.63 Hz', label: '1st · High e' },
]

const TIPS = [
  'Play one string at a time — avoid touching other strings',
  'Turn the tuning peg slowly — small adjustments matter most',
  'Blue needle = flat (too low) → tighten the string',
  'Red needle = sharp (too high) → loosen the string',
  'Always tune up from below — it holds pitch longer',
]

export default function TunerPage() {
  const { result, isListening, error, start, stop } = useAudioCapture()

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Dynamic background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: isListening ? 1.3 : 1,
            opacity: isListening ? 0.18 : 0.06,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500 blur-[100px]"
        />
        <div className="bg-grid absolute inset-0 opacity-40" />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Guitar Tuner</h1>
          <p className="text-gray-500 text-sm">Standard tuning (E A D G B e) · Play one string at a time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-5"
        >
          {/* Main tuner */}
          <TunerComponent result={result} isListening={isListening} />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl p-4 border border-red-500/20 bg-red-500/5"
              >
                <p className="text-red-400 text-sm">⚠ {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listen button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={isListening ? stop : start}
              className={`relative px-14 py-4 rounded-2xl text-base font-bold transition-all duration-300 overflow-hidden ${
                isListening
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'border border-cyan-400/30 text-cyan-400 hover:border-cyan-400/60 glow-cyan bg-cyan-500/5'
              }`}
            >
              {/* Pulse rings when active */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-2xl border border-red-400/30 animate-pulse-ring" />
                  <span
                    className="absolute inset-0 rounded-2xl border border-red-400/20 animate-pulse-ring"
                    style={{ animationDelay: '0.8s' }}
                  />
                </>
              )}
              <span className="relative flex items-center gap-2">
                <span>{isListening ? '⏹' : '🎤'}</span>
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </span>
            </motion.button>
          </div>

          {/* String reference grid */}
          <div className="glass rounded-3xl p-6 border border-border/60">
            <h2 className="text-[10px] uppercase tracking-widest text-gray-600 mb-4 font-semibold">
              Standard Tuning Reference
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STRINGS.map((s, i) => {
                const active = !!(result?.signal && result?.string_num === s.num)
                return (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                      active
                        ? 'border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                        : 'border-border/60 bg-white/[0.02] hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-base font-black font-mono ${active ? 'text-cyan-300' : 'text-white'}`}>
                        {s.note}
                      </span>
                      <span className="text-[10px] text-gray-600 font-semibold">#{s.num}</span>
                    </div>
                    <div className="text-gray-500 text-xs">{s.freq}</div>
                    <div className="text-gray-600 text-[10px] mt-0.5">{s.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="glass rounded-3xl p-6 border border-border/60">
            <h2 className="text-[10px] uppercase tracking-widest text-gray-600 mb-4 font-semibold">Tuning Tips</h2>
            <ul className="space-y-2.5">
              {TIPS.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className="flex items-start gap-3 text-sm text-gray-400"
                >
                  <span className="text-cyan-400/70 shrink-0 mt-0.5 text-xs font-bold">→</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
