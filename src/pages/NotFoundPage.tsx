import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-rose-50 flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-6xl font-bold text-gray-200">404</h2>
      <p className="text-gray-500 mt-4 mb-6">페이지를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className="px-5 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
      >
        홈으로
      </Link>
    </div>
  )
}
