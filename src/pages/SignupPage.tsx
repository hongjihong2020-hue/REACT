import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError('root', { message: error.message })
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
          <h1 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">회원가입</h1>
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
                placeholder="6자 이상 입력해주세요"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                  focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                  ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                  focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                  ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
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
                  가입 중...
                </span>
              ) : '회원가입'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-rose-400 font-medium hover:text-rose-500">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
