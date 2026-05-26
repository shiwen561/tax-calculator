import { Home, History, Building2, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { id: 'home', path: '/', icon: Home, label: '首页' },
  { id: 'history', path: '/history', icon: History, label: '历史记录' },
  { id: 'entities', path: '/entities', icon: Building2, label: '常用主体' },
  { id: 'profile', path: '/profile', icon: User, label: '我的' },
]

export default function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path || 
            (tab.id === 'home' && location.pathname === '/')

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
