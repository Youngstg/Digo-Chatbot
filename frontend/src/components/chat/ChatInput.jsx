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
      className="flex items-end gap-3 p-4 bg-white border border-[#7288AE] rounded-2xl shadow-xl"
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
          flex-1 resize-none border-0 bg-transparent px-2 py-2
          text-base text-[#111844] focus:outline-none focus:ring-0
          disabled:opacity-50 min-h-[44px] max-h-[120px]
          placeholder:text-[#7288AE] transition-all
        "
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="
          bg-[#111844] hover:bg-[#4B5694] disabled:opacity-50 disabled:bg-[#7288AE] disabled:cursor-not-allowed
          text-[#EAE0CF] rounded-xl px-5 h-11 text-sm font-semibold shadow transition-colors
          flex items-center gap-2 flex-shrink-0
        "
      >
        <span>Kirim</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  )
}
