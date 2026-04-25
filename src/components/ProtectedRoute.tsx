import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Spinner from '@/components/Spinner'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Spinner className="text-rose-300" />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}
