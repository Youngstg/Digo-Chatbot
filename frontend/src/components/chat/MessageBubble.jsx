export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
          <img src="/image/Logo_only.png" alt="Bot Logo" className="w-full h-full object-contain mix-blend-multiply" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap break-words shadow-sm
          ${isUser
            ? 'bg-[#4B5694] text-white rounded-tr-none'
            : 'bg-[#EAE0CF] text-[#111844] rounded-tl-none'
          }
        `}
      >
        {message.content}
      </div>
    </div>
  )
}
