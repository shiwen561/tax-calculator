import { useState } from 'react'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ResultCard from '../components/ResultCard'
import { calculatePersonalTax, formatCurrency, formatPercent } from '../utils/taxCalculator'
import { useStore } from '../store'
import { personalTaxSubtypes } from '../data/taxPolicies'
import type { PersonalTaxInput, PersonalTaxResult } from '../types'
import { useNavigate } from 'react-router-dom'

export default function PersonalTax() {
  const navigate = useNavigate()
  const addHistory = useStore((state) => state.addHistory)

  const [activeTab, setActiveTab] = useState<string>('salary')
  const [input, setInput] = useState<PersonalTaxInput>({
    type: 'salary',
    income: 20000,
    socialInsurance: 2500,
    housingFund: 1500,
    specialDeductions: 3000,
    otherDeductions: 0,
  })
  const [result, setResult] = useState<PersonalTaxResult | null>(null)

  const handleInputChange = (field: keyof PersonalTaxInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setInput((prev) => ({ ...prev, type: tabId as PersonalTaxInput['type'] }))
    setResult(null)
  }

  const handleCalculate = () => {
    const taxResult = calculatePersonalTax(input)
    setResult(taxResult)

    addHistory({
      taxType: 'personal_income',
      taxSubtype: input.type,
      inputData: { ...input },
      resultData: { ...taxResult },
    })
  }

  const handleViewDetail = () => {
    if (result) {
      sessionStorage.setItem('currentResult', JSON.stringify({
        title: '个人所得税计算明细',
        inputData: input,
        resultData: result,
        details: result.details,
      }))
      navigate('/detail/temp')
    }
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="个人所得税计算" />

      <div className="flex border-b border-gray-100 bg-white">
        {personalTaxSubtypes.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-gray-500'
            }`}
          >
            {tab.name}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <InputField
            label="本期收入（元）"
            placeholder="请输入本期应发工资"
            value={input.income.toString()}
            onChange={(e) => handleInputChange('income', parseFloat(e.target.value) || 0)}
          />

          {activeTab === 'salary' && (
            <>
              <InputField
                label="各项社会保险（元）"
                placeholder="请输入社会保险金额"
                value={input.socialInsurance.toString()}
                onChange={(e) => handleInputChange('socialInsurance', parseFloat(e.target.value) || 0)}
              />
              <InputField
                label="住房公积金（元）"
                placeholder="请输入住房公积金金额"
                value={input.housingFund.toString()}
                onChange={(e) => handleInputChange('housingFund', parseFloat(e.target.value) || 0)}
              />
              <InputField
                label="专项附加扣除（元）"
                placeholder="子女教育、住房贷款利息等"
                value={input.specialDeductions.toString()}
                onChange={(e) => handleInputChange('specialDeductions', parseFloat(e.target.value) || 0)}
              />
              <InputField
                label="其他扣除（元）"
                placeholder="请输入其他扣除项（如年金等）"
                value={input.otherDeductions.toString()}
                onChange={(e) => handleInputChange('otherDeductions', parseFloat(e.target.value) || 0)}
              />
            </>
          )}

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
              { label: '本期应纳税额', value: result.taxAmount, highlight: true },
              { label: '预扣率', value: formatPercent(result.taxRate) },
              { label: '速算扣除数', value: formatCurrency(result.deduction) },
              { label: '应纳税所得额', value: formatCurrency(result.taxableIncome) },
              { label: '适用税率', value: formatPercent(result.taxRate) },
              { label: '本期应预扣预缴税额', value: formatCurrency(result.taxAmount), highlight: true },
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
