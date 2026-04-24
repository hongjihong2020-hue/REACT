import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { StyleReport } from '@/types/style'

async function fetchHairstyle(
  photo: string,
  setImage: (v: string) => void,
  setError: (v: string) => void,
  setLoading: (v: boolean) => void,
) {
  try {
    const res = await fetch('/api/hairstyle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: photo }),
    })
    const text = await res.text()
    let data: { image?: string; error?: string }
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error('서버 응답 오류입니다. 잠시 후 다시 시도해주세요.')
    }
    if (data.error) throw new Error(data.error)
    if (data.image) setImage(data.image)
  } catch (err) {
    setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
  } finally {
    setLoading(false)
  }
}

interface LocationState {
  report: StyleReport
  photo: string
  height: string
  weight: string
}

export default function StyleReportPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [hairstyleImage, setHairstyleImage] = useState<string | null>(null)
  const [hairstyleLoading, setHairstyleLoading] = useState(true)
  const [hairstyleError, setHairstyleError] = useState<string | null>(null)

  useEffect(() => {
    if (!state?.photo) return

    fetchHairstyle(state.photo, setHairstyleImage, setHairstyleError, setHairstyleLoading)
  }, [state?.photo])

  if (!state?.report) {
    navigate('/', { replace: true })
    return null
  }

  const { report, photo, height, weight } = state

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 p-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-rose-400 uppercase">
            Style Report
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
            나만의 스타일 컨설팅 보고서
          </h1>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-6">
          <img
            src={photo}
            alt="프로필"
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
          />
          <div className="flex-1">
            <p className="text-xl font-bold text-gray-900">{report.bodyType.type}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{report.bodyType.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-gray-400">신체 정보</p>
            <p className="text-lg font-semibold text-gray-700">{height}cm</p>
            <p className="text-lg font-semibold text-gray-700">{weight}kg</p>
          </div>
        </div>

        {/* 추천 스타일 */}
        <Section title="추천 스타일" emoji="👗">
          <ul className="space-y-3">
            {report.recommendedStyles.map((style, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-rose-100 text-rose-500 text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{style}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 컬러 팔레트 */}
        <Section title="컬러 팔레트" emoji="🎨">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">추천 색상</p>
              <div className="flex flex-wrap gap-2">
                {report.colorPalette.recommended.map((color, i) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-sm rounded-full font-medium">
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">피할 색상</p>
              <div className="flex flex-wrap gap-2">
                {report.colorPalette.avoid.map((color, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-500 text-sm rounded-full font-medium line-through">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 피해야 할 스타일 */}
        <Section title="피해야 할 스타일" emoji="🚫">
          <ul className="space-y-3">
            {report.avoidStyles.map((style, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-gray-300 shrink-0">✕</span>
                <span className="text-gray-600 text-sm leading-relaxed">{style}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 스타일링 팁 */}
        <Section title="스타일링 팁" emoji="✨">
          <ul className="space-y-3">
            {report.stylingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-rose-400 shrink-0">→</span>
                <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 추천 헤어스타일 */}
        <Section title="추천 헤어스타일 9선" emoji="💇">
          {hairstyleLoading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-4">
              <div className="relative w-12 h-12">
                <svg className="animate-spin w-12 h-12 text-rose-200" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">AI가 헤어스타일을 생성하고 있습니다</p>
                <p className="text-xs text-gray-400 mt-1">20~60초 정도 소요됩니다</p>
              </div>
            </div>
          ) : hairstyleError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-400">{hairstyleError}</p>
              <button
                onClick={() => {
                  setHairstyleError(null)
                  setHairstyleLoading(true)
                  fetchHairstyle(photo, setHairstyleImage, setHairstyleError, setHairstyleLoading)
                }}
                className="mt-3 text-xs text-rose-400 underline"
              >
                다시 시도
              </button>
            </div>
          ) : hairstyleImage ? (
            <div>
              <img
                src={hairstyleImage}
                alt="AI 추천 헤어스타일 9선"
                className="w-full rounded-xl"
              />
              <p className="text-xs text-gray-400 text-center mt-3">
                AI가 생성한 이미지로 실제와 다를 수 있습니다
              </p>
            </div>
          ) : null}
        </Section>

        {/* 다시 분석 버튼 */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium
            hover:border-gray-300 hover:bg-white active:scale-[0.98] transition-all duration-150"
        >
          다시 분석하기
        </button>
      </div>
    </div>
  )
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>{emoji}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}
