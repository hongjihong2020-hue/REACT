import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-6xl font-bold text-gray-200">404</h2>
      <p className="text-gray-500 mt-4 mb-6">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        홈으로
      </Link>
    </div>
  )
}
