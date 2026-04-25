import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      navigate(data.session ? '/' : '/login', { replace: true })
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
      <Spinner className="text-rose-300" />
      <p className="text-sm text-gray-400">이메일 확인 중...</p>
    </div>
  )
}
