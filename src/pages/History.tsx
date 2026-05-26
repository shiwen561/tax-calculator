import { useState } from 'react'
import { Trash2, ChevronRight, Search } from 'lucide-react'
import Header from '../components/Header'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'

const taxTypeNames: Record<string, string> = {
  personal_income: '个人所得税',
  vat: '增值税',
  corporate_income: '企业所得税',
  property: '房产税',
  stamp: '印花税',
  landValue: '土地增值税',
  deed: '契税',
}

export default function History() {
  const navigate = useNavigate()
  const history = useStore((state) => state.history)
  const clearHistory = useStore((state) => state.clearHistory)

  const [filter, setFilter] = useState('全部')
  const [searchText, setSearchText] = useState('')

  const filterOptions = ['全部', '个人所得税', '增值税', '企业所得税', '其他']

  const filteredHistory = history.filter((record) => {
    const taxTypeName = taxTypeNames[record.taxType] || record.taxType
    const matchesFilter = filter === '全部' || 
      (filter === '其他' && !['个人所得税', '增值税', '企业所得税'].includes(taxTypeName)) ||
      taxTypeName === filter
    const matchesSearch = searchText === '' || 
      record.taxSubtype?.toLowerCase().includes(searchText.toLowerCase()) ||
      taxTypeName.toLowerCase().includes(searchText.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getResultAmount = (record: typeof history[0]) => {
    const resultData = record.resultData as Record<string, number>
    return resultData.taxAmount || resultData.totalAmount || 0
  }

  const handleViewDetail = (record: typeof history[0]) => {
    const taxTypeName = taxTypeNames[record.taxType] || record.taxType
    sessionStorage.setItem('currentResult', JSON.stringify({
      title: `${taxTypeName}(${record.taxSubtype})计算明细`,
      inputData: record.inputData,
      resultData: record.resultData,
      details: record.resultData.details,
    }))
    navigate('/detail/temp')
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="历史记录" />

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索税种/主体名称/备注"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === option
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">暂无计算记录</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">共 {filteredHistory.length} 条记录</span>
              <button
                onClick={clearHistory}
                className="text-sm text-error flex items-center gap-1"
              >
                <Trash2 size={14} />
                清空全部
              </button>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((record) => {
                const taxTypeName = taxTypeNames[record.taxType] || record.taxType
                const amount = getResultAmount(record)
                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between group"
                  >
                    <button
                      onClick={() => handleViewDetail(record)}
                      className="flex-1 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {taxTypeName.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{taxTypeName}</span>
                          <span className="text-xs text-gray-400">({record.taxSubtype})</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(record.createdAt)}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-4">
                      <span className="text-error font-semibold">
                        {amount.toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
