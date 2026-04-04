import { useState, useCallback } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  agent?: string
  agent_role?: string
}

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<string | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)
    setCurrentAgent(null)

    // Build history in OpenAI/Anthropic format
    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response,
        agent: data.agent,
        agent_role: data.agent_role,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setCurrentAgent(data.agent)
    } catch (err) {
      const errMsg: Message = {
        role: 'assistant',
        content: err instanceof Error ? `Error: ${err.message}` : 'Something went wrong.',
        agent: 'System',
        agent_role: 'error',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([])
    setCurrentAgent(null)
  }, [])

  return { messages, isLoading, currentAgent, sendMessage, clearChat }
}
