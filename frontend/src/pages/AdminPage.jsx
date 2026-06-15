import { useEffect, useState } from 'react'
import { leadService } from '../services/leadService'
import { knowledgeBaseService } from '../services/knowledgeBaseService'

const STATUS_LABELS = {
  new:       { label: 'Baru',       color: 'bg-[#4B5694]/10 text-[#4B5694]' },
  contacted: { label: 'Dihubungi',  color: 'bg-[#EAE0CF] text-[#111844]' },
  qualified: { label: 'Qualified',  color: 'bg-[#111844]/10 text-[#111844]' },
  closed:    { label: 'Closed',     color: 'bg-[#7288AE]/20 text-[#7288AE]' },
}

const CATEGORIES = ['service', 'pricing', 'faq', 'portfolio', 'promotion', 'policy']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('leads')

  // Leads State
  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(true)

  // Knowledge Base State
  const [kbList, setKbList] = useState([])
  const [kbLoading, setKbLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    category: 'faq',
    title: '',
    content: '',
    is_active: 1
  })

  useEffect(() => {
    fetchLeads()
    fetchKb()
  }, [])

  const fetchLeads = () => {
    setLeadsLoading(true)
    leadService.getAll()
      .then((data) => setLeads(data.data || []))
      .catch(console.error)
      .finally(() => setLeadsLoading(false))
  }

  const fetchKb = () => {
    setKbLoading(true)
    knowledgeBaseService.getAll()
      .then((data) => setKbList(data.data || []))
      .catch(console.error)
      .finally(() => setKbLoading(false))
  }

  // --- Lead Actions ---
  const handleStatusChange = async (id, status) => {
    await leadService.updateStatus(id, status)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  // --- Knowledge Base Actions ---
  const openAddModal = () => {
    setFormData({ category: 'faq', title: '', content: '', is_active: 1 })
    setEditingId(null)
    setShowModal(true)
  }

  const openEditModal = (kb) => {
    setFormData({ 
      category: kb.category, 
      title: kb.title, 
      content: kb.content, 
      is_active: kb.is_active ? 1 : 0 
    })
    setEditingId(kb.id)
    setShowModal(true)
  }

  const handleDeleteKb = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await knowledgeBaseService.delete(id)
      fetchKb()
    }
  }

  const handleSaveKb = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await knowledgeBaseService.update(editingId, formData)
      } else {
        await knowledgeBaseService.create(formData)
      }
      setShowModal(false)
      fetchKb()
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat menyimpan data.")
    }
  }

  return (
    <div className="min-h-screen bg-[#EAE0CF]/30 font-sans">
      {/* Admin Navbar */}
      <nav className="bg-[#111844] text-[#EAE0CF] px-8 py-4 flex items-center justify-between shadow-md border-b-4 border-[#4B5694]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/image/Logo_only.png" alt="Logo" className="w-full h-full object-contain mix-blend-multiply brightness-200" />
          </div>
          <span className="font-bold text-lg tracking-wide">Admin Dashboard</span>
        </div>
        <div className="text-sm font-medium text-[#7288AE]">
          Control Panel
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#111844]">Digo Control Panel</h1>
            <p className="text-[#4B5694] text-base mt-2">Pilih modul yang ingin Anda kelola.</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-[#7288AE]/30">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-[#111844] text-white shadow' : 'text-[#7288AE] hover:text-[#111844]'}`}
            >
              Kelola Leads
            </button>
            <button 
              onClick={() => setActiveTab('knowledge')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'knowledge' ? 'bg-[#111844] text-white shadow' : 'text-[#7288AE] hover:text-[#111844]'}`}
            >
              Knowledge Base
            </button>
          </div>
        </div>

        {/* Tab Content: LEADS */}
        {activeTab === 'leads' && (
          <div>
            {leadsLoading ? (
              <div className="text-center py-20 text-[#7288AE] text-lg">Memuat data leads...</div>
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
        )}

        {/* Tab Content: KNOWLEDGE BASE */}
        {activeTab === 'knowledge' && (
          <div>
            <div className="flex justify-end mb-4">
              <button 
                onClick={openAddModal}
                className="bg-[#4B5694] hover:bg-[#111844] text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <span>+ Tambah Data</span>
              </button>
            </div>

            {kbLoading ? (
              <div className="text-center py-20 text-[#7288AE] text-lg">Memuat data knowledge base...</div>
            ) : kbList.length === 0 ? (
              <div className="text-center py-20 text-[#7288AE] text-lg">Knowledge base masih kosong.</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-[#7288AE]/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#111844] text-[#EAE0CF] text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-6 py-4 w-32">Kategori</th>
                        <th className="px-6 py-4">Judul</th>
                        <th className="px-6 py-4 w-24">Status</th>
                        <th className="px-6 py-4 w-32 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#7288AE]/20">
                      {kbList.map((kb) => (
                        <tr key={kb.id} className="hover:bg-[#EAE0CF]/20 transition-colors">
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg border border-gray-200">
                              {kb.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#111844]">{kb.title}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${kb.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {kb.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center gap-2">
                            <button 
                              onClick={() => openEditModal(kb)}
                              className="px-3 py-1.5 bg-[#EAE0CF] hover:bg-[#4B5694] text-[#111844] hover:text-white rounded-lg font-bold transition-colors text-xs"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteKb(kb.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg font-bold transition-colors text-xs"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal CRUD Knowledge Base */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#111844] text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Knowledge Base' : 'Tambah Knowledge Base'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSaveKb} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#111844] mb-1">Kategori</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#111844] focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111844] mb-1">Status</label>
                  <select 
                    value={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#111844] focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                  >
                    <option value={1}>Aktif</option>
                    <option value={0}>Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111844] mb-1">Judul / Pertanyaan</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#111844] focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                  placeholder="Misal: Berapa harga layanannya?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111844] mb-1">Konten / Jawaban</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#111844] focus:outline-none focus:ring-2 focus:ring-[#4B5694] resize-none"
                  placeholder="Isi jawaban lengkap yang akan dibaca oleh bot..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#4B5694] hover:bg-[#111844] text-white font-bold rounded-lg shadow transition-colors"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
