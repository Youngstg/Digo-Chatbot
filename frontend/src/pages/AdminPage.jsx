import { useEffect, useState } from 'react'
import { leadService } from '../services/leadService'

const STATUS_LABELS = {
  new:       { label: 'Baru',       color: 'bg-[#4B5694]/10 text-[#4B5694]' },
  contacted: { label: 'Dihubungi',  color: 'bg-[#EAE0CF] text-[#111844]' },
  qualified: { label: 'Qualified',  color: 'bg-[#111844]/10 text-[#111844]' },
  closed:    { label: 'Closed',     color: 'bg-[#7288AE]/20 text-[#7288AE]' },
}

export default function AdminPage() {
  const [leads, setLeads]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leadService.getAll()
      .then((data) => setLeads(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id, status) => {
    await leadService.updateStatus(id, status)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  return (
    <div className="min-h-screen bg-[#EAE0CF]/30 font-sans">
      {/* Admin Navbar */}
      <nav className="bg-[#111844] text-[#EAE0CF] px-8 py-4 flex items-center justify-between shadow-md border-b-4 border-[#4B5694]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#EAE0CF] rounded flex items-center justify-center">
            <span className="text-[#111844] font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-lg tracking-wide">Admin Dashboard</span>
        </div>
        <div className="text-sm font-medium text-[#7288AE]">
          Sistem Pengelola Lead
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111844]">Kelola Lead Chatbot</h1>
          <p className="text-[#4B5694] text-base mt-2">Daftar prospek yang terkumpul dari sistem obrolan cerdas.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#7288AE] text-lg">Memuat data...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-[#7288AE] text-lg">Belum ada lead masuk.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-[#7288AE]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#111844] text-[#EAE0CF] text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    {['Nama', 'Email', 'Telepon', 'Bisnis', 'Budget', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7288AE]/20">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#EAE0CF]/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#111844]">{lead.name}</td>
                      <td className="px-6 py-4 text-[#4B5694]">{lead.email || '-'}</td>
                      <td className="px-6 py-4 text-[#4B5694]">{lead.phone || '-'}</td>
                      <td className="px-6 py-4 text-[#4B5694]">{lead.business_type || '-'}</td>
                      <td className="px-6 py-4 text-[#4B5694]">{lead.budget || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${STATUS_LABELS[lead.status]?.color}`}>
                          {STATUS_LABELS[lead.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="text-xs font-medium border border-[#7288AE]/50 rounded-lg px-3 py-2 text-[#111844] focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white cursor-pointer"
                        >
                          {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
