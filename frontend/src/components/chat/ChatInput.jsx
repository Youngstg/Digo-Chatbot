import { useState, useRef } from 'react'

export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 bg-white"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan... (Enter untuk kirim)"
        disabled={disabled}
        rows={1}
        className="
          flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2
          text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:bg-gray-50 min-h-[40px] max-h-[120px]
          placeholder:text-gray-400 transition-all
        "
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="
          bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
          text-white rounded-xl px-4 h-10 text-sm font-medium transition-colors
          flex items-center gap-1 flex-shrink-0
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  )
}
