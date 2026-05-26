import { useState } from 'react'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ResultCard from '../components/ResultCard'
import { calculateCorporateTax, formatCurrency, formatPercent } from '../utils/taxCalculator'
import { useStore } from '../store'
import { taxPolicies } from '../data/taxPolicies'
import type { CorporateTaxInput, CorporateTaxResult } from '../types'
import { useNavigate } from 'react-router-dom'

export default function CorporateTax() {
  const navigate = useNavigate()
  const addHistory = useStore((state) => state.addHistory)

  const [type, setType] = useState<'general' | 'smallProfit'>('smallProfit')
  const [input, setInput] = useState<CorporateTaxInput>({
    type: 'smallProfit',
    profit: 2000000,
  })
  const [result, setResult] = useState<CorporateTaxResult | null>(null)

  const handleInputChange = (field: keyof CorporateTaxInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleTypeChange = (newType: 'general' | 'smallProfit') => {
    setType(newType)
    setInput((prev) => ({ ...prev, type: newType }))
    setResult(null)
  }

  const handleCalculate = () => {
    const taxResult = calculateCorporateTax(input)
    setResult(taxResult)

    addHistory({
      taxType: 'corporate_income',
      taxSubtype: type === 'general' ? '一般企业' : '小型微利企业',
      inputData: { ...input },
      resultData: { ...taxResult },
    })
  }

  const handleViewDetail = () => {
    if (result) {
      sessionStorage.setItem('currentResult', JSON.stringify({
        title: '企业所得税计算明细',
        inputData: input,
        resultData: result,
        details: result.details,
      }))
      navigate('/detail/temp')
    }
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="企业所得税计算" />

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex mb-6 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => handleTypeChange('general')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                type === 'general'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              一般企业
            </button>
            <button
              onClick={() => handleTypeChange('smallProfit')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                type === 'smallProfit'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              小型微利企业
            </button>
          </div>

          {type === 'smallProfit' && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">小型微利企业所得税优惠政策</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                自2023年1月1日至2027年12月31日，对小型微利企业年应纳税所得额不超过300万元的部分，减按25%计入应纳税所得额，按20%的税率缴纳企业所得税。
              </p>
              <div className="mt-2 flex gap-4 text-xs">
                <span className="text-primary">• 年应纳税所得额 ≤ 300万元</span>
              </div>
            </div>
          )}

          <InputField
            label="利润总额（元）"
            placeholder="请输入利润总额"
            value={input.profit.toString()}
            onChange={(e) => handleInputChange('profit', parseFloat(e.target.value) || 0)}
          />

          <button
            onClick={handleCalculate}
            className="w-full mt-2 py-3 bg-gradient-to-r from-primary to-primaryDark text-white font-medium rounded-xl shadow-button hover:opacity-90 transition-opacity"
          >
            立即计算
          </button>
        </div>

        {result && (
          <ResultCard
            title="计算结果"
            items={[
              { label: '应纳税所得额', value: formatCurrency(result.taxableIncome) },
              { label: '应纳所得税额', value: formatCurrency(result.taxAmount), highlight: true },
              { label: '适用税率', value: type === 'smallProfit' ? '20%' : formatPercent(taxPolicies.corporateIncome.generalRate) },
              { label: '有效税率', value: formatPercent(result.effectiveRate) },
            ]}
            onViewDetail={handleViewDetail}
          />
        )}

        <div className="mt-4 bg-white rounded-2xl shadow-card p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">税率说明</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">一般企业税率</span>
              <span className="font-medium">{(taxPolicies.corporateIncome.generalRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">小型微利企业税率</span>
              <span className="font-medium">{(taxPolicies.corporateIncome.smallProfitEnterprise.rate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">小型微利企业减计比例</span>
              <span className="font-medium">{(taxPolicies.corporateIncome.smallProfitEnterprise.reduction * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          * 本结果仅供参考，具体以税务机关核定为准
        </p>
      </div>
    </div>
  )
}
