import { useState } from 'react'
import ChatWidget from '../components/chat/ChatWidget'
import LeadForm from '../components/lead/LeadForm'
import { useChatContext } from '../store/ChatContext'

export default function ChatPage() {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const { conversationId } = useChatContext()

  return (
    <div className="h-screen w-full bg-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Floating Lead Form Toggle */}
      {!showLeadForm ? (
        <button
          onClick={() => setShowLeadForm(true)}
          className="absolute top-4 right-4 z-50 px-4 py-2 bg-white text-[#111844] text-sm font-medium rounded-xl shadow-md border border-[#7288AE]/30 hover:bg-[#EAE0CF] transition-colors"
        >
          Hubungi Tim Kami
        </button>
      ) : (
        <div className="absolute top-16 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#7288AE]/50">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-sm font-semibold text-[#111844]">Form Kontak</span>
            <button
              onClick={() => setShowLeadForm(false)}
              className="text-[#7288AE] hover:text-[#111844] text-xl leading-none"
            >
              ×
            </button>
          </div>
          <LeadForm
            conversationId={conversationId}
            onSuccess={() => setTimeout(() => setShowLeadForm(false), 3000)}
          />
        </div>
      )}

      {/* Fullscreen Chat Widget */}
      <div className="flex-1 w-full h-full">
        <ChatWidget />
      </div>
    </div>
  )
}
