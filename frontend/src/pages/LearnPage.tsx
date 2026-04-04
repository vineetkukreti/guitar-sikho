import AgentChat from '../components/AgentChat'
import { useAgentChat } from '../hooks/useAgentChat'
import { motion } from 'framer-motion'

const AGENTS = [
  {
    icon: '👨‍🏫',
    name: 'Senior Tutor',
    desc: 'Learning & theory',
    grad: 'from-amber-400 to-orange-500',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/10',
  },
  {
    icon: '🎵',
    name: 'Tab Finder',
    desc: 'Hindi song tabs',
    grad: 'from-blue-400 to-cyan-500',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/10',
  },
  {
    icon: '🎛️',
    name: 'Tuning Expert',
    desc: 'Pitch & tuning',
    grad: 'from-violet-400 to-purple-500',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-500/10',
  },
]

export default function LearnPage() {
  const { messages, isLoading, currentAgent, sendMessage, clearChat } = useAgentChat()

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-orb absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[90px]" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6 h-full flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center shrink-0"
        >
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">AI Guitar Tutor</h1>
          <p className="text-gray-500 text-xs">Powered by Claude · Senior Tutor + Tab Finder + Tuning Expert</p>
        </motion.div>

        {/* Agent cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="grid grid-cols-3 gap-3 shrink-0"
        >
          {AGENTS.map((a) => (
            <div
              key={a.name}
              className={`glass rounded-2xl p-3.5 border ${a.border} hover:shadow-lg ${a.glow} transition-all text-center group`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.grad} flex items-center justify-center text-xl mx-auto mb-2 shadow-md`}
              >
                {a.icon}
              </div>
              <div className="text-xs font-bold text-white">{a.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{a.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Chat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="flex-1 glass rounded-3xl border border-border/60 overflow-hidden"
        >
          <AgentChat
            messages={messages}
            isLoading={isLoading}
            currentAgent={currentAgent}
            onSend={sendMessage}
            onClear={clearChat}
          />
        </motion.div>
      </div>
    </div>
  )
}
