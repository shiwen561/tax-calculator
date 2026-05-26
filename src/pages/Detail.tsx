import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, Download, Share2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { exportToExcel, generateReportHtml, downloadHtml } from '../utils/export'

interface DetailData {
  title: string
  inputData: Record<string, unknown>
  resultData: Record<string, unknown>
  details: { stepName: string; formula: string; value: number }[]
}

export default function Detail() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<DetailData | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('currentResult')
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [params.id])

  if (!data) {
    return (
      <div className="min-h-screen bg-bgLight flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatValue = (value: unknown): string => {
    if (typeof value === 'number') {
      return formatNumber(value)
    }
    const valueMap: Record<string, string> = {
      taxIncluded: '含税金额',
      taxExcluded: '不含税金额',
      general: '一般企业',
      smallProfit: '小型微利企业',
      salary: '工资薪金',
      yearlyBonus: '全年奖',
      serviceFee: '劳务报酬',
      royalty: '特许权使用费',
      copyright: '稿酬所得',
    }
    return valueMap[String(value)] || String(value)
  }

  const formatKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      income: '收入金额',
      socialInsurance: '社会保险',
      housingFund: '住房公积金',
      specialDeductions: '专项附加扣除',
      otherDeductions: '其他扣除',
      amountType: '金额类型',
      amount: '金额',
      rate: '税率',
      urbanMaintenanceRate: '城建税税率',
      type: '企业类型',
      profit: '利润总额',
      taxType: '税种',
      baseAmount: '计税依据',
      taxableIncome: '应纳税所得额',
      taxAmount: '应纳税额',
      taxRate: '适用税率',
      deduction: '速算扣除数',
      netIncome: '税后收入',
      taxExcludedAmount: '不含税金额',
      vatAmount: '增值税额',
      urbanMaintenanceAmount: '城建税额',
      educationSurchargeAmount: '教育费附加',
      localEducationSurchargeAmount: '地方教育附加',
      totalAmount: '合计应纳税额',
      effectiveRate: '实际税负率',
    }
    return keyMap[key] || key
  }

  const handleExportExcel = () => {
    const exportData = [
      { 项目: '计算项目', 值: data.title },
      ...Object.entries(data.inputData).map(([key, value]) => ({
        项目: formatKey(key),
        值: formatValue(value),
      })),
      { 项目: '---', 值: '---' },
      ...data.details.map((detail) => ({
        项目: detail.stepName,
        值: formatNumber(detail.value),
      })),
      { 项目: '---', 值: '---' },
      ...Object.entries(data.resultData).map(([key, value]) => ({
        项目: formatKey(key),
        值: formatValue(value),
      })),
    ]
    exportToExcel(exportData, `税务计算明细_${data.title}`)
  }

  const handleExportHtml = () => {
    const html = generateReportHtml(data.title, data.inputData, data.resultData, data.details)
    downloadHtml(html, `税务计算明细_${data.title}`)
  }

  const handleShare = () => {
    alert('分享功能开发中')
  }

  return (
    <div className="min-h-screen bg-bgLight pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-12 px-4 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">计算明细</h1>
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-primary" />
            <h2 className="font-semibold text-gray-800">{data.title}</h2>
          </div>

          <div className="text-xs text-gray-400 mb-4">计算时间：{new Date().toLocaleString('zh-CN')}</div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">一、输入参数</h3>
            <div className="space-y-2">
              {Object.entries(data.inputData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-50 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">{formatKey(key)}</span>
                  <span className="text-sm font-medium text-gray-800">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">二、计算步骤</h3>
            <div className="space-y-3">
              {data.details.map((detail, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{detail.stepName}</span>
                      {detail.formula && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {detail.formula}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${detail.value < 0 ? 'text-gray-500' : 'text-primary'}`}>
                      {formatNumber(detail.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">三、计算结果</h3>
            <div className="bg-blue-50 rounded-xl p-4 space-y-3">
              {Object.entries(data.resultData).map(([key, value]) => {
                if (key === 'details') return null
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700">{formatKey(key)}</span>
                    <span className={`text-base font-semibold ${key.includes('税额') || key.includes('应纳税') ? 'text-error' : 'text-gray-800'}`}>
                      {formatValue(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs text-gray-400 text-center">
              * 本计算结果仅供参考，具体以税务机关核定为准
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportExcel}
            className="flex-1 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>导出Excel</span>
          </button>
          <button
            onClick={handleExportHtml}
            className="flex-1 py-3 bg-gradient-to-r from-primary to-primaryDark text-white rounded-xl flex items-center justify-center gap-2 font-medium"
          >
            <Download size={18} />
            <span>导出报告</span>
          </button>
        </div>
      </div>
    </div>
  )
}
