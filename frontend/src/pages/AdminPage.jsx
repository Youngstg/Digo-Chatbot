import { useEffect, useState } from 'react'
import { leadService } from '../services/leadService'

const STATUS_LABELS = {
  new:       { label: 'Baru',       color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Dihubungi',  color: 'bg-yellow-100 text-yellow-700' },
  qualified: { label: 'Qualified',  color: 'bg-green-100 text-green-700' },
  closed:    { label: 'Closed',     color: 'bg-gray-100 text-gray-600' },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola lead yang masuk dari chatbot</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Memuat data...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Belum ada lead masuk.</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Nama', 'Email', 'Telepon', 'Bisnis', 'Budget', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.phone || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.business_type || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.budget || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[lead.status]?.color}`}>
                        {STATUS_LABELS[lead.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        )}
      </div>
    </div>
  )
}
