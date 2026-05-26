import { Info } from 'lucide-react'

interface ResultItem {
  label: string
  value: string | number
  highlight?: boolean
  suffix?: string
}

interface ResultCardProps {
  title: string
  items: ResultItem[]
  onViewDetail?: () => void
}

export default function ResultCard({ title, items, onViewDetail }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {onViewDetail && (
          <button
            onClick={onViewDetail}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <Info size={16} />
            <span>查看计算明细</span>
          </button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
          >
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center gap-1">
              {typeof item.value === 'number' && (
                <span
                  className={`text-base font-semibold ${
                    item.highlight ? 'text-error' : 'text-gray-800'
                  }`}
                >
                  {item.value.toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
              {typeof item.value === 'string' && (
                <span className={`text-base font-semibold ${item.highlight ? 'text-error' : 'text-gray-800'}`}>
                  {item.value}
                </span>
              )}
              {item.suffix && (
                <span className="text-sm text-gray-400">{item.suffix}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
