import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="bg-[#111844] text-[#EAE0CF] px-4 md:px-6 py-4 flex items-center gap-3 flex-shrink-0 shadow-md z-10">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="p-1.5 md:p-2 text-[#7288AE] hover:text-[#EAE0CF] hover:bg-[#4B5694] rounded-full transition-colors mr-1"
          title="Kembali ke Beranda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        {/* Bot Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 overflow-hidden flex items-center justify-center">
            <img src="/image/Logo_only.png" alt="Digo Logo" className="w-full h-full object-contain" />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#111844] rounded-full" />
        </div>
        
        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base md:text-lg leading-tight truncate">Digo Bot</p>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetChat}
          title="Reset percakapan"
          className="p-2 text-[#7288AE] hover:text-[#EAE0CF] hover:bg-[#4B5694] rounded-lg transition-colors flex-shrink-0"
        >
          {/* Outline Reset/Refresh Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-24 lg:px-48 xl:px-64 pt-8 pb-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-end gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
              <img src="/image/Logo_only.png" alt="Bot Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="bg-[#EAE0CF] text-[#111844] rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-0 md:px-24 lg:px-48 xl:px-64 pb-6">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
