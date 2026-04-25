import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-rose-400 uppercase">
            Personal Stylist
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">로그인</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                {...register('email')}
                type="email"
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                  focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                  ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                  focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                  ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-4 py-3">{errors.root.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium tracking-wide
                hover:bg-gray-700 active:scale-[0.98] transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="text-rose-400 font-medium hover:text-rose-500">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
