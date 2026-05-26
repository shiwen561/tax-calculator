import { Calculator, TrendingUp, ChevronRight } from 'lucide-react'
import TaxTypeCard from '../components/TaxTypeCard'
import { taxTypes, policyNotices } from '../data/taxPolicies'

export default function Home() {
  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <div className="bg-gradient-to-r from-primary to-primaryDark text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold">税务计算助手</h1>
            <p className="text-xs text-white/80">专业 · 精准 · 合规</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm font-medium">全税种计算一站式解决</p>
          <p className="text-xs text-white/70 mt-1">与最新政策实时同步</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">热门税种</h2>
          <button className="text-sm text-primary font-medium flex items-center gap-1">
            全部税种
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {taxTypes.map((tax) => (
            <TaxTypeCard key={tax.id} tax={tax} />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary" />
          <h2 className="text-base font-semibold text-gray-800">政策速递</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {policyNotices.map((notice) => (
            <button
              key={notice.id}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    notice.tag === '最新' ? 'bg-red-100 text-red-600' :
                    notice.tag === '政策' ? 'bg-primary/10 text-primary' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {notice.tag}
                  </span>
                  <span className="text-xs text-gray-400">{notice.date}</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-2">{notice.title}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">使用提示</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 选择税种后填写相关信息</li>
            <li>• 点击计算获取详细结果</li>
            <li>• 支持保存计算历史记录</li>
            <li>• 可导出计算报告</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
