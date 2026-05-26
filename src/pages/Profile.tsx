import { useState } from 'react'
import { User, Settings, Bell, HelpCircle, Shield, ChevronRight, LogOut, Eye } from 'lucide-react'
import Header from '../components/Header'
import { useStore } from '../store'

const menuItems = [
  { icon: Bell, label: '政策更新提醒', description: '最新政策变化通知' },
  { icon: Settings, label: '系统设置', description: '个性化配置' },
  { icon: HelpCircle, label: '帮助中心', description: '使用指南' },
  { icon: Shield, label: '隐私设置', description: '数据安全' },
]

export default function Profile() {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const history = useStore((state) => state.history)

  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = () => {
    const mockUser = {
      id: 'mock-user-id',
      nickname: '会计小王',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
    }
    setUser(mockUser)
    setShowLogin(false)
  }

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      setUser(null)
    }
  }

  const handleViewPrivacy = () => {
    alert('隐私设置页面开发中')
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="我的" showBack={false} />

      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-primary to-primaryDark rounded-2xl p-4 text-white">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.nickname}</h2>
                <p className="text-sm text-white/70">已登录</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium"
              >
                <LogOut size={16} className="inline mr-1" />
                退出
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User size={28} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-lg font-semibold">点击登录</h2>
                <p className="text-sm text-white/70">微信一键授权</p>
              </div>
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-card p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">数据统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{history.length}</div>
              <div className="text-xs text-gray-400 mt-1">计算记录</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">9</div>
              <div className="text-xs text-gray-400 mt-1">税种支持</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">2024</div>
              <div className="text-xs text-gray-400 mt-1">政策版本</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.label === '隐私设置' ? handleViewPrivacy : () => alert(`${item.label}页面开发中`)}
                className="w-full px-4 py-4 flex items-center gap-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            )
          })}
        </div>

        <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-primary" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800">数据同步</h3>
              <p className="text-xs text-gray-600">登录后支持跨设备数据同步</p>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">税务计算助手 v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">专业 · 精准 · 合规</p>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">微信一键登录</h3>
              <p className="text-sm text-gray-500 mb-6">登录后可享受数据同步、历史记录等功能</p>
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
              >
                微信授权登录
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="w-full mt-3 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                暂不登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
