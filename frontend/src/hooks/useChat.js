import { useState, useCallback } from 'react'
import { chatService } from '../services/chatService'
import { generateSessionId } from '../utils/helpers'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Halo! Saya Digo, AI Sales Assistant. 👋\n\nSaya siap membantu Anda menemukan layanan digital yang tepat untuk bisnis Anda. Ada yang bisa saya bantu?',
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId] = useState(() => generateSessionId())
  const [conversationId, setConversationId] = useState(null)

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return

      const userMessage = { role: 'user', content: text }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const data = await chatService.sendMessage(text, sessionId)

        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ])
      } catch (err) {
        const errorMsg = 'Maaf, terjadi kesalahan. Silakan coba lagi. 🙏'
        setError('Gagal mengirim pesan.')
        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }])
      } finally {
        setIsLoading(false)
      }
    },
    [sessionId, isLoading]
  )

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sessionId,
    conversationId,
    sendMessage,
    resetChat,
  }
}
