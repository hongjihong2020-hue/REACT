import { useAuthStore } from '@/store/authStore'

const stats = [
  { label: '총 사용자', value: '1,234', change: '+12%' },
  { label: '오늘 방문자', value: '456', change: '+5%' },
  { label: '총 매출', value: '₩12,340,000', change: '+8%' },
  { label: '활성 세션', value: '89', change: '-2%' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">안녕하세요, {user?.name}님</h2>
      <p className="text-gray-500 mb-8">오늘의 현황을 확인하세요.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} 전월 대비
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
