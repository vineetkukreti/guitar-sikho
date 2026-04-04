import { useState, useRef, useCallback } from 'react'

export interface TunerResult {
  frequency: number
  note: string
  octave: number
  cents: number
  string: string
  string_num: number
  in_tune: boolean
  signal: boolean
}

export function useAudioCapture() {
  const [result, setResult] = useState<TunerResult | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      const context = new AudioContext({ sampleRate: 44100 })
      contextRef.current = context

      const source = context.createMediaStreamSource(stream)
      const processor = context.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      const ws = new WebSocket(`ws://localhost:8000/ws/tuner`)
      wsRef.current = ws

      ws.onopen = () => {
        source.connect(processor)
        processor.connect(context.destination)
        setIsListening(true)
      }

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as TunerResult
          setResult(data)
        } catch {}
      }

      ws.onerror = () => setError('WebSocket connection failed')
      ws.onclose = () => setIsListening(false)

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return
        const channelData = e.inputBuffer.getChannelData(0)
        const buffer = new ArrayBuffer(channelData.length * 4)
        const view = new DataView(buffer)
        channelData.forEach((val, i) => view.setFloat32(i * 4, val, true))
        ws.send(buffer)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied')
    }
  }, [])

  const stop = useCallback(() => {
    processorRef.current?.disconnect()
    contextRef.current?.close()
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setIsListening(false)
    setResult(null)
  }, [])

  return { result, isListening, error, start, stop }
}
