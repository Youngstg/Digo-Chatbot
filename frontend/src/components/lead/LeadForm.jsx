import { useState } from 'react'
import { leadService } from '../../services/leadService'
import Button from '../ui/Button'

const FIELDS = [
  { name: 'name',          label: 'Nama Lengkap',       type: 'text',  required: true },
  { name: 'email',         label: 'Email',               type: 'email', required: false },
  { name: 'phone',         label: 'No. WhatsApp',        type: 'tel',   required: false },
  { name: 'business_type', label: 'Jenis Bisnis',        type: 'text',  required: false },
  { name: 'budget',        label: 'Budget (opsional)',   type: 'text',  required: false },
]

export default function LeadForm({ conversationId, onSuccess }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_type: '', requirement: '', budget: '',
  })
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]     = useState({})

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      await leadService.submit({ ...form, conversation_id: conversationId })
      setSubmitted(true)
      onSuccess?.()
    } catch {
      alert('Gagal mengirim data. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-semibold text-gray-800 text-lg">Terima kasih!</p>
        <p className="text-gray-500 text-sm mt-1">Tim kami akan segera menghubungi Anda.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4">
      <div className="mb-1">
        <h3 className="font-semibold text-gray-800 text-base">Hubungi Tim Kami</h3>
        <p className="text-xs text-gray-500">Isi form berikut agar tim kami bisa menghubungi Anda.</p>
      </div>

      {FIELDS.map((field) => (
        <div key={field.name}>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.label + (field.required ? ' *' : '')}
            required={field.required}
            value={form[field.name]}
            onChange={handleChange}
            className={`
              w-full border rounded-lg px-3 py-2 text-sm transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors[field.name] ? 'border-red-400' : 'border-gray-200'}
            `}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <textarea
        name="requirement"
        placeholder="Ceritakan kebutuhan Anda secara singkat..."
        value={form.requirement}
        onChange={handleChange}
        rows={3}
        className="
          w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        "
      />

      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? 'Mengirim...' : 'Kirim Data'}
      </Button>
    </form>
  )
}
