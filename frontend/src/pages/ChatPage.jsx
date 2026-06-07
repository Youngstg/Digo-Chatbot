import { useState } from 'react'
import ChatWidget from '../components/chat/ChatWidget'
import LeadForm from '../components/lead/LeadForm'
import { useChatContext } from '../store/ChatContext'

export default function ChatPage() {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const { conversationId } = useChatContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Chat Widget */}
        <div className="h-[580px] shadow-2xl rounded-2xl overflow-hidden border border-white/50">
          <ChatWidget />
        </div>

        {/* Lead Form Toggle */}
        {!showLeadForm ? (
          <button
            onClick={() => setShowLeadForm(true)}
            className="
              w-full py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium
              rounded-xl shadow border border-gray-100 transition-colors
            "
          >
            💬 Ingin dihubungi tim kami? Klik di sini
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="text-sm text-gray-500">Form Kontak</span>
              <button
                onClick={() => setShowLeadForm(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
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
      </div>
    </div>
  )
}
