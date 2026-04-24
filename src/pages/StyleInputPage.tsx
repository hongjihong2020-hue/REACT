import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  height: z
    .string()
    .min(1, '키를 입력해주세요')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 100 && Number(v) <= 250, '100~250cm 범위로 입력해주세요'),
  weight: z
    .string()
    .min(1, '몸무게를 입력해주세요')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 20 && Number(v) <= 300, '20~300kg 범위로 입력해주세요'),
})

type FormData = z.infer<typeof schema>

export default function StyleInputPage() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onSubmit = async (data: FormData) => {
    // TODO: API 연동
    console.log({ photo, height: Number(data.height), weight: Number(data.weight) })
    alert('스타일 분석을 시작합니다!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-[0.3em] text-rose-400 uppercase">
            Personal Stylist
          </span>
          <h1 className="mt-2 text-4xl font-bold text-gray-900 tracking-tight">
            나만의 스타일 분석
          </h1>
          <p className="mt-3 text-gray-500">
            사진과 신체 정보를 입력하면 AI가 맞춤 스타일을 제안해드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* 사진 업로드 영역 */}
              <div className="p-8 flex flex-col items-center justify-center gap-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`relative w-full aspect-[3/4] max-w-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden flex flex-col items-center justify-center gap-3 group
                    ${isDragging
                      ? 'border-rose-400 bg-rose-50'
                      : photo
                      ? 'border-transparent'
                      : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/40'
                    }`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt="업로드된 사진"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">사진 변경</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm font-medium text-gray-700">사진 업로드</p>
                        <p className="text-xs text-gray-400 mt-1">클릭 또는 드래그</p>
                      </div>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />

                <p className="text-xs text-gray-400 text-center">
                  전신 사진을 올리면<br />더 정확한 분석이 가능합니다
                </p>
              </div>

              {/* 신체 정보 입력 영역 */}
              <div className="p-8 flex flex-col justify-center gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">신체 정보</h2>
                  <p className="text-sm text-gray-400">정확한 핏 추천을 위해 필요합니다</p>
                </div>

                {/* 키 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">키</label>
                  <div className="relative">
                    <input
                      {...register('height')}
                      type="number"
                      placeholder="170"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                        focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                        ${errors.height ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      cm
                    </span>
                  </div>
                  {errors.height && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.height.message}
                    </p>
                  )}
                </div>

                {/* 몸무게 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">몸무게</label>
                  <div className="relative">
                    <input
                      {...register('weight')}
                      type="number"
                      placeholder="60"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl text-gray-900 placeholder-gray-300 outline-none transition-all
                        focus:ring-2 focus:ring-rose-200 focus:border-rose-400
                        ${errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      kg
                    </span>
                  </div>
                  {errors.weight && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.weight.message}
                    </p>
                  )}
                </div>

                {/* BMI 안내 */}
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    입력하신 정보는 스타일 추천에만 활용되며,<br />
                    외부에 공개되지 않습니다.
                  </p>
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={isSubmitting || !photo}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium tracking-wide
                    hover:bg-gray-700 active:scale-[0.98] transition-all duration-150
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      분석 중...
                    </span>
                  ) : (
                    '스타일 분석 시작하기'
                  )}
                </button>

                {!photo && (
                  <p className="text-xs text-center text-gray-400">사진을 먼저 업로드해주세요</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
