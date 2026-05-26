import { useState } from 'react'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ResultCard from '../components/ResultCard'
import { calculateOtherTax, formatCurrency, formatPercent } from '../utils/taxCalculator'
import { useStore } from '../store'
import { taxPolicies } from '../data/taxPolicies'
import type { OtherTaxInput, OtherTaxResult } from '../types'
import { useNavigate } from 'react-router-dom'

const taxOptions = [
  { id: 'property', name: '房产税' },
  { id: 'stamp', name: '印花税' },
  { id: 'landValue', name: '土地增值税' },
  { id: 'deed', name: '契税' },
]

export default function OtherTaxes() {
  const navigate = useNavigate()
  const addHistory = useStore((state) => state.addHistory)

  const [selectedTax, setSelectedTax] = useState('property')
  const [input, setInput] = useState<OtherTaxInput>({
    taxType: 'property',
    baseAmount: 1000000,
    rate: 0.012,
  })
  const [result, setResult] = useState<OtherTaxResult | null>(null)

  const currentTaxRates = taxPolicies.otherTaxes.find((t) => t.taxType === selectedTax)?.rates || []

  const handleInputChange = (field: keyof OtherTaxInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleTaxChange = (taxId: string) => {
    setSelectedTax(taxId)
    const rates = taxPolicies.otherTaxes.find((t) => t.taxType === taxId)?.rates || []
    setInput((prev) => ({
      ...prev,
      taxType: taxId,
      rate: rates[0]?.rate || 0,
    }))
    setResult(null)
  }

  const handleCalculate = () => {
    const taxResult = calculateOtherTax(input)
    setResult(taxResult)

    const taxName = taxOptions.find((t) => t.id === selectedTax)?.name || selectedTax

    addHistory({
      taxType: selectedTax,
      taxSubtype: taxName,
      inputData: { ...input },
      resultData: { ...taxResult },
    })
  }

  const handleViewDetail = () => {
    if (result) {
      const taxName = taxOptions.find((t) => t.id === selectedTax)?.name || selectedTax
      sessionStorage.setItem('currentResult', JSON.stringify({
        title: `${taxName}计算明细`,
        inputData: input,
        resultData: result,
        details: result.details,
      }))
      navigate('/detail/temp')
    }
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="其他税种计算" />

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择税种</label>
            <div className="grid grid-cols-2 gap-2">
              {taxOptions.map((tax) => (
                <button
                  key={tax.id}
                  onClick={() => handleTaxChange(tax.id)}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    selectedTax === tax.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tax.name}
                </button>
              ))}
            </div>
          </div>

          <InputField
            label="计税依据（元）"
            placeholder="请输入计税依据"
            value={input.baseAmount.toString()}
            onChange={(e) => handleInputChange('baseAmount', parseFloat(e.target.value) || 0)}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">适用税率</label>
            <div className="space-y-2">
              {currentTaxRates.map((rate) => (
                <button
                  key={rate.rate}
                  onClick={() => {
                    handleInputChange('rate', rate.rate)
                    setResult(null)
                  }}
                  className={`w-full px-4 py-2 rounded-xl text-sm border flex justify-between items-center transition-colors ${
                    input.rate === rate.rate
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{(rate.rate * 100).toFixed(4)}%</span>
                  <span className="text-xs text-gray-500">{rate.description}</span>
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
              { label: '计税依据', value: formatCurrency(input.baseAmount) },
              { label: '适用税率', value: formatPercent(input.rate) },
              { label: '应纳税额', value: formatCurrency(result.taxAmount), highlight: true },
            ]}
            onViewDetail={handleViewDetail}
          />
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          * 本结果仅供参考，具体以税务机关核定为准
        </p>
      </div>
    </div>
  )
}
