import { useRef, useEffect } from 'react'
import { useChatContext } from '../../store/ChatContext'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import LoadingDots from '../ui/LoadingDots'

export default function ChatWidget() {
  const { messages, isLoading, sendMessage, resetChat } = useChatContext()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
            D
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight">Digo</p>
          <p className="text-xs text-blue-200 leading-tight">AI Sales Assistant • Online</p>
        </div>
        <button
          onClick={resetChat}
          title="Reset percakapan"
          className="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-end gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              D
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
