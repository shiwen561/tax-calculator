import { useState } from 'react'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ResultCard from '../components/ResultCard'
import { calculateVat, formatCurrency } from '../utils/taxCalculator'
import { useStore } from '../store'
import { taxPolicies } from '../data/taxPolicies'
import type { VatInput, VatResult } from '../types'
import { useNavigate } from 'react-router-dom'

export default function VatTax() {
  const navigate = useNavigate()
  const addHistory = useStore((state) => state.addHistory)

  const [amountType, setAmountType] = useState<'taxIncluded' | 'taxExcluded'>('taxIncluded')
  const [input, setInput] = useState<VatInput>({
    amountType: 'taxIncluded',
    amount: 11300,
    rate: 0.13,
    urbanMaintenanceRate: 0.07,
  })
  const [result, setResult] = useState<VatResult | null>(null)

  const allRates = [
    ...taxPolicies.vat.generalRates,
    ...taxPolicies.vat.specialRates,
  ]

  const handleInputChange = (field: keyof VatInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleAmountTypeChange = (type: 'taxIncluded' | 'taxExcluded') => {
    setAmountType(type)
    setInput((prev) => ({ ...prev, amountType: type }))
    setResult(null)
  }

  const handleCalculate = () => {
    const taxResult = calculateVat(input)
    setResult(taxResult)

    addHistory({
      taxType: 'vat',
      taxSubtype: amountType === 'taxIncluded' ? '含税' : '不含税',
      inputData: { ...input },
      resultData: { ...taxResult },
    })
  }

  const handleViewDetail = () => {
    if (result) {
      sessionStorage.setItem('currentResult', JSON.stringify({
        title: '增值税计算明细',
        inputData: input,
        resultData: result,
        details: result.details,
      }))
      navigate('/detail/temp')
    }
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="增值税计算" />

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex mb-6 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => handleAmountTypeChange('taxIncluded')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                amountType === 'taxIncluded'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              含税金额
            </button>
            <button
              onClick={() => handleAmountTypeChange('taxExcluded')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                amountType === 'taxExcluded'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              不含税金额
            </button>
          </div>

          <InputField
            label={amountType === 'taxIncluded' ? '含税金额（元）' : '不含税金额（元）'}
            placeholder={`请输入${amountType === 'taxIncluded' ? '含税' : '不含税'}金额`}
            value={input.amount.toString()}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              适用税率/征收率
            </label>
            <div className="grid grid-cols-2 gap-2">
              {allRates.map((rate) => (
                <button
                  key={rate.rate}
                  onClick={() => {
                    handleInputChange('rate', rate.rate)
                    setResult(null)
                  }}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    input.rate === rate.rate
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{(rate.rate * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500 truncate">{rate.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              城建税税率
            </label>
            <div className="grid grid-cols-3 gap-2">
              {taxPolicies.additional.urbanMaintenance.map((item) => (
                <button
                  key={item.rate}
                  onClick={() => {
                    handleInputChange('urbanMaintenanceRate', item.rate)
                    setResult(null)
                  }}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    input.urbanMaintenanceRate === item.rate
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{(item.rate * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">{item.area}</div>
                </button>
              ))}
            </div>
          </div>

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
              { label: '不含税金额', value: formatCurrency(result.taxExcludedAmount) },
              { label: '增值税额', value: formatCurrency(result.vatAmount) },
              { label: '城建税', value: formatCurrency(result.urbanMaintenanceAmount) },
              { label: '教育费附加', value: formatCurrency(result.educationSurchargeAmount) },
              { label: '地方教育附加', value: formatCurrency(result.localEducationSurchargeAmount) },
              { label: '合计应纳税额', value: formatCurrency(result.totalAmount), highlight: true },
            ]}
            onViewDetail={handleViewDetail}
          />
        )}

        <div className="mt-4 bg-white rounded-2xl shadow-card p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">税率及附加设置</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">城建税税率</span>
              <span className="text-primary font-medium">{(input.urbanMaintenanceRate * 100).toFixed(0)}%（市区）</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">教育费附加率</span>
              <span className="font-medium">{(taxPolicies.additional.educationSurcharge * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地方教育附加率</span>
              <span className="font-medium">{(taxPolicies.additional.localEducationSurcharge * 100).toFixed(0)}%</span>
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
