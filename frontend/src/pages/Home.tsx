import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🎵',
    title: 'Guitar Tuner',
    description: 'Real-time pitch detection. Play a note and watch the needle lock in instantly.',
    to: '/tuner',
    iconGrad: 'from-cyan-400 to-green-400',
    hoverBorder: 'hover:border-cyan-400/40',
    hoverGlow: 'hover:shadow-cyan-500/10',
    accentText: 'group-hover:text-cyan-300',
    tag: 'Live',
    tagColor: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  },
  {
    icon: '🎸',
    title: 'Hindi Song Tabs',
    description: '10 popular Bollywood songs — full tabs, chords, strumming patterns.',
    to: '/tabs',
    iconGrad: 'from-amber-400 to-orange-500',
    hoverBorder: 'hover:border-amber-400/40',
    hoverGlow: 'hover:shadow-amber-500/10',
    accentText: 'group-hover:text-amber-300',
    tag: '10 Songs',
    tagColor: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  },
  {
    icon: '🤖',
    title: 'AI Guitar Tutor',
    description: 'Three AI agents — Senior Tutor, Tab Finder, and Tuning Expert — at your fingertips.',
    to: '/learn',
    iconGrad: 'from-violet-400 to-purple-500',
    hoverBorder: 'hover:border-violet-400/40',
    hoverGlow: 'hover:shadow-violet-500/10',
    accentText: 'group-hover:text-violet-300',
    tag: 'Claude AI',
    tagColor: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  },
]

const songs = ['Tum Hi Ho', 'Kesariya', 'Channa Mereya', 'Kal Ho Na Ho', 'Raabta', 'Ve Maahi']

const agents = [
  {
    icon: '👨‍🏫',
    name: 'Senior Guitar Tutor',
    desc: 'Learning paths, music theory, expert advice',
    grad: 'from-amber-500 to-orange-500',
    shadow: 'hover:shadow-amber-500/20',
  },
  {
    icon: '🎵',
    name: 'Junior Tab Finder',
    desc: 'Searches & explains Hindi song tabs',
    grad: 'from-blue-500 to-cyan-500',
    shadow: 'hover:shadow-blue-500/20',
  },
  {
    icon: '🎛️',
    name: 'Tuning Assistant',
    desc: 'Pitch expert, frequencies & tuning help',
    grad: 'from-violet-500 to-purple-500',
    shadow: 'hover:shadow-violet-500/20',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-orb absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div
          className="animate-orb absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full bg-amber-500/8 blur-[100px]"
          style={{ animationDelay: '3.5s' }}
        />
        <div
          className="animate-orb absolute bottom-10 left-1/3 w-[360px] h-[360px] rounded-full bg-cyan-500/6 blur-[100px]"
          style={{ animationDelay: '7s' }}
        />
        <div className="bg-grid absolute inset-0 opacity-50" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#07070f_100%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 py-16">

        {/* ── Hero ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          {/* Floating guitar */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-7 relative"
          >
            <span className="text-[72px] leading-none drop-shadow-2xl">🎸</span>
            <div className="absolute inset-0 bg-amber-400/15 blur-2xl rounded-full -z-10 scale-150" />
          </motion.div>

          <h1 className="text-7xl sm:text-8xl font-black tracking-tight leading-none mb-6">
            <span className="gradient-text">Guitar</span>
            <span className="text-white">Sikho</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-md mx-auto leading-relaxed mb-10">
            AI-powered tutoring, real-time tuning, and Bollywood guitar tabs — all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/tuner"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base
                  bg-gradient-to-r from-amber-500 to-amber-400 text-black
                  shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow"
              >
                Start Tuning <span>🎵</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base
                  bg-white/[0.06] border border-white/10 text-white
                  hover:bg-white/10 hover:border-white/20 transition-all"
              >
                Ask AI Tutor <span>🤖</span>
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="mt-16 flex justify-center"
          >
            <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5">
              <div className="w-1 h-1.5 rounded-full bg-white/40" />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Feature cards ────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
            >
              <Link
                to={f.to}
                className={`group gradient-border-hover block glass rounded-3xl p-7 border border-border/60
                  ${f.hoverBorder} hover:shadow-xl ${f.hoverGlow} transition-all duration-300 h-full`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.iconGrad} flex items-center justify-center text-2xl mb-5 shadow-lg`}
                >
                  {f.icon}
                </div>

                {/* Tag */}
                <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-3 ${f.tagColor}`}>
                  {f.tag}
                </span>

                <h3 className={`text-lg font-bold text-white mb-2 transition-colors duration-200 ${f.accentText}`}>
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>

                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-gray-600 group-hover:text-gray-300 transition-colors">
                  <span>Open →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom grid ──────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Song list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-3xl p-6 border border-border/60"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-base">Available Song Tabs</h2>
              <Link
                to="/tabs"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold tracking-wide"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {songs.map((song, i) => (
                <motion.div
                  key={song}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-amber-400/20 transition-all group cursor-default"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 text-[11px] font-black shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{song}</span>
                  <span className="ml-auto text-amber-400/0 group-hover:text-amber-400/70 text-xs transition-all">♪</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Agents */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass rounded-3xl p-6 border border-border/60"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-base">Meet Your AI Agents</h2>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-violet-400/10 text-violet-400 border-violet-400/20">
                Powered by Claude
              </span>
            </div>
            <div className="space-y-3">
              {agents.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:shadow-lg ${a.shadow} transition-all group cursor-default`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.grad} flex items-center justify-center text-xl shrink-0 shadow-md`}
                  >
                    {a.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{a.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Footer nudge ─────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-gray-700 text-xs mt-16 tracking-wide"
        >
          Built for guitar learners who love Bollywood 🎸
        </motion.p>
      </div>
    </div>
  )
}
