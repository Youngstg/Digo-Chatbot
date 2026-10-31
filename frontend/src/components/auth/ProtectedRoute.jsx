import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAE0CF]/30 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#111844] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#111844] font-medium text-sm">Memeriksa autentikasi...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

