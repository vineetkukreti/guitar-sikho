import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '../hooks/useAgentChat'

interface Props {
  messages: Message[]
  isLoading: boolean
  currentAgent: string | null
  onSend: (text: string) => void
  onClear: () => void
}

const AGENT_CONFIG: Record<string, { icon: string; style: string; dotColor: string }> = {
  senior: { icon: '👨‍🏫', style: 'text-amber-400 border-amber-400/25 bg-amber-400/10', dotColor: 'bg-amber-400' },
  junior: { icon: '🎵',    style: 'text-blue-400  border-blue-400/25  bg-blue-400/10',  dotColor: 'bg-blue-400'  },
  tuning: { icon: '🎛️',   style: 'text-violet-400 border-violet-400/25 bg-violet-400/10', dotColor: 'bg-violet-400' },
  error:  { icon: '⚠️',   style: 'text-red-400   border-red-400/25   bg-red-400/10',   dotColor: 'bg-red-400'   },
}

const SUGGESTIONS = [
  { text: 'How do I hold a guitar properly?',       icon: '🤚' },
  { text: 'Teach me Tum Hi Ho on guitar',           icon: '🎵' },
  { text: 'What are the easiest chords for beginners?', icon: '🎸' },
  { text: 'Show me tabs for Channa Mereya',         icon: '📋' },
  { text: 'How do I tune my guitar by ear?',        icon: '👂' },
  { text: 'Create a 4-week practice plan for me',   icon: '📅' },
]

export default function AgentChat({ messages, isLoading, currentAgent, onSend, onClear }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    onSend(text)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentAgent ? 'bg-green-400 animate-pulse' : isLoading ? 'bg-amber-400 animate-pulse' : 'bg-gray-700'
            }`}
          />
          <span className="text-xs text-gray-500">
            {currentAgent
              ? `${currentAgent} is responding`
              : isLoading
              ? 'Routing to best agent...'
              : 'AI Tutor ready'}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors font-medium"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-4"
            >
              🎸
            </motion.div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Ask me anything about guitar! I'll route your question to the right expert.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s.text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => onSend(s.text)}
                  className="flex items-center gap-2.5 text-left text-xs px-3.5 py-2.5 rounded-xl
                    border border-border/60 hover:border-amber-400/30 hover:bg-amber-400/5
                    text-gray-400 hover:text-gray-200 transition-all group"
                >
                  <span className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">{s.icon}</span>
                  <span>{s.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message bubbles */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const agentCfg = msg.agent_role ? AGENT_CONFIG[msg.agent_role] : null
            const isUser = msg.role === 'user'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[82%]">
                  {/* Agent badge */}
                  {!isUser && agentCfg && (
                    <div className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border mb-1.5 ${agentCfg.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agentCfg.dotColor}`} />
                      <span>{agentCfg.icon}</span>
                      <span>{msg.agent}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 text-white rounded-tr-sm'
                        : 'glass text-gray-200 rounded-tl-sm border-border/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3.5 border border-border/50">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-500"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask about chords, tabs, tuning, practice tips..."
            rows={1}
            className="flex-1 bg-white/[0.04] border border-border/70 rounded-2xl px-4 py-3 text-sm text-white
              placeholder-gray-600 focus:outline-none focus:border-amber-400/35 focus:bg-white/[0.06]
              resize-none transition-all"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm
              shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 disabled:opacity-35
              disabled:cursor-not-allowed transition-all"
          >
            Send
          </motion.button>
        </div>
        <p className="text-[10px] text-gray-700 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
