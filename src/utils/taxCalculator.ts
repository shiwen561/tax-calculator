import type { PersonalTaxInput, PersonalTaxResult, VatInput, VatResult, CorporateTaxInput, CorporateTaxResult, OtherTaxInput, OtherTaxResult, CalculationDetail } from '../types'
import { taxPolicies } from '../data/taxPolicies'

export const calculatePersonalTax = (input: PersonalTaxInput): PersonalTaxResult => {
  const { type, income, socialInsurance, housingFund, specialDeductions, otherDeductions } = input
  const details: CalculationDetail[] = []
  let stepOrder = 1

  let taxableIncome: number
  let taxAmount = 0
  let taxRate = 0
  let deduction = 0
  let netIncome = 0

  if (type === 'salary') {
    details.push({
      stepName: '本期收入',
      formula: '',
      value: income,
      stepOrder: stepOrder++,
    })

    const totalDeductions = socialInsurance + housingFund + taxPolicies.personalIncome.standardDeduction + specialDeductions + otherDeductions

    details.push({
      stepName: '各项社会保险',
      formula: '',
      value: -socialInsurance,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '住房公积金',
      formula: '',
      value: -housingFund,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '专项附加扣除',
      formula: '',
      value: -specialDeductions,
      stepOrder: stepOrder++,
    })

    if (otherDeductions > 0) {
      details.push({
        stepName: '其他扣除',
        formula: '',
        value: -otherDeductions,
        stepOrder: stepOrder++,
      })
    }

    details.push({
      stepName: '收入小计',
      formula: `本期收入 - 社会保险 - 住房公积金 - 专项附加扣除 - 其他扣除`,
      value: income - socialInsurance - housingFund - specialDeductions - otherDeductions,
      stepOrder: stepOrder++,
    })

    taxableIncome = Math.max(0, income - totalDeductions)

    details.push({
      stepName: '应纳税所得额',
      formula: `收入小计 - 费用扣除(${taxPolicies.personalIncome.standardDeduction})`,
      value: taxableIncome,
      stepOrder: stepOrder++,
    })

    const bracket = taxPolicies.personalIncome.brackets.find(
      (b) => taxableIncome > b.min && (b.max === null || taxableIncome <= b.max)
    ) || taxPolicies.personalIncome.brackets[0]

    taxRate = bracket.rate
    deduction = bracket.deduction
    taxAmount = Math.max(0, taxableIncome * taxRate - deduction)

    details.push({
      stepName: '适用税率',
      formula: '',
      value: taxRate,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '速算扣除数',
      formula: '',
      value: deduction,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税额',
      formula: `应纳税所得额 × 税率 - 速算扣除数 = ${taxableIncome.toFixed(2)} × ${(taxRate * 100).toFixed(0)}% - ${deduction}`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })

    netIncome = income - socialInsurance - housingFund - taxAmount
  } else if (type === 'yearlyBonus') {
    taxableIncome = income
    const monthlyIncome = income / 12

    const bracket = taxPolicies.personalIncome.brackets.find(
      (b) => monthlyIncome > b.min && (b.max === null || monthlyIncome <= b.max)
    ) || taxPolicies.personalIncome.brackets[0]

    taxRate = bracket.rate
    deduction = bracket.deduction
    taxAmount = income * taxRate - deduction
    netIncome = income - taxAmount

    details.push({
      stepName: '全年一次性奖金',
      formula: '',
      value: income,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '平均每月收入',
      formula: `全年奖金 ÷ 12`,
      value: monthlyIncome,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '适用税率',
      formula: '',
      value: taxRate,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '速算扣除数',
      formula: '',
      value: deduction,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税额',
      formula: `全年奖金 × 税率 - 速算扣除数 = ${income.toFixed(2)} × ${(taxRate * 100).toFixed(0)}% - ${deduction}`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })
  } else if (type === 'serviceFee') {
    const expenseDeduction = income <= 4000 ? 800 : income * 0.2
    taxableIncome = income - expenseDeduction
    const bracket = taxPolicies.personalIncome.brackets.find(
      (b) => taxableIncome > b.min && (b.max === null || taxableIncome <= b.max)
    ) || taxPolicies.personalIncome.brackets[0]

    taxRate = bracket.rate
    deduction = bracket.deduction
    taxAmount = taxableIncome * taxRate - deduction
    netIncome = income - taxAmount

    details.push({
      stepName: '劳务报酬收入',
      formula: '',
      value: income,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '费用扣除',
      formula: income <= 4000 ? '固定扣除800元' : '收入 × 20%',
      value: expenseDeduction,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税所得额',
      formula: `收入 - 费用扣除`,
      value: taxableIncome,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税额',
      formula: `应纳税所得额 × 税率 - 速算扣除数`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })
  } else {
    const typeName = type === 'copyright' ? '稿酬所得' : '特许权使用费'
    const expenseDeduction = income <= 4000 ? 800 : income * 0.2
    taxableIncome = Math.max(0, (income - expenseDeduction) * (type === 'copyright' ? 0.7 : 1))
    const bracket = taxPolicies.personalIncome.brackets.find(
      (b) => taxableIncome > b.min && (b.max === null || taxableIncome <= b.max)
    ) || taxPolicies.personalIncome.brackets[0]

    taxRate = bracket.rate
    deduction = bracket.deduction
    taxAmount = Math.max(0, taxableIncome * taxRate - deduction)
    netIncome = income - taxAmount

    details.push({
      stepName: typeName + '收入',
      formula: '',
      value: income,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '费用扣除',
      formula: income <= 4000 ? '固定扣除800元' : '收入 × 20%',
      value: expenseDeduction,
      stepOrder: stepOrder++,
    })

    if (type === 'copyright') {
      details.push({
        stepName: '稿酬所得减征30%',
        formula: `(收入 - 费用扣除) × 30%`,
        value: (income - expenseDeduction) * 0.3,
        stepOrder: stepOrder++,
      })
    }

    details.push({
      stepName: '应纳税所得额',
      formula: type === 'copyright'
        ? `(收入 - 费用扣除) × 70%`
        : `收入 - 费用扣除`,
      value: taxableIncome,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '适用税率',
      formula: '',
      value: taxRate,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '速算扣除数',
      formula: '',
      value: deduction,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税额',
      formula: `应纳税所得额 × 税率 - 速算扣除数 = ${taxableIncome.toFixed(2)} × ${(taxRate * 100).toFixed(0)}% - ${deduction}`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })
  }

  return {
    taxableIncome,
    taxAmount,
    taxRate,
    deduction,
    netIncome,
    details,
  }
}

export const calculateVat = (input: VatInput): VatResult => {
  const { amountType, amount, rate, urbanMaintenanceRate } = input
  const details: CalculationDetail[] = []
  let stepOrder = 1

  const { educationSurcharge, localEducationSurcharge } = taxPolicies.additional

  let taxExcludedAmount: number
  let vatAmount: number

  if (amountType === 'taxIncluded') {
    taxExcludedAmount = amount / (1 + rate)
    vatAmount = amount - taxExcludedAmount
  } else {
    taxExcludedAmount = amount
    vatAmount = amount * rate
  }

  const urbanMaintenanceAmount = vatAmount * urbanMaintenanceRate
  const educationSurchargeAmount = vatAmount * educationSurcharge
  const localEducationSurchargeAmount = vatAmount * localEducationSurcharge
  const totalAmount = vatAmount + urbanMaintenanceAmount + educationSurchargeAmount + localEducationSurchargeAmount

  details.push({
    stepName: amountType === 'taxIncluded' ? '含税金额' : '不含税金额',
    formula: '',
    value: amount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '适用税率',
    formula: '',
    value: rate,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '不含税金额',
    formula: amountType === 'taxIncluded' ? `含税金额 ÷ (1 + 税率)` : '',
    value: taxExcludedAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '增值税额',
    formula: amountType === 'taxIncluded' ? `含税金额 - 不含税金额` : `不含税金额 × 税率`,
    value: vatAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '城建税',
    formula: `增值税额 × ${(urbanMaintenanceRate * 100).toFixed(0)}%`,
    value: urbanMaintenanceAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '教育费附加',
    formula: `增值税额 × ${(educationSurcharge * 100).toFixed(0)}%`,
    value: educationSurchargeAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '地方教育附加',
    formula: `增值税额 × ${(localEducationSurcharge * 100).toFixed(0)}%`,
    value: localEducationSurchargeAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '合计应纳税额',
    formula: `增值税 + 城建税 + 教育费附加 + 地方教育附加`,
    value: totalAmount,
    stepOrder: stepOrder++,
  })

  return {
    taxExcludedAmount,
    vatAmount,
    urbanMaintenanceAmount,
    educationSurchargeAmount,
    localEducationSurchargeAmount,
    totalAmount,
    details,
  }
}

export const calculateCorporateTax = (input: CorporateTaxInput): CorporateTaxResult => {
  const { type, profit } = input
  const details: CalculationDetail[] = []
  let stepOrder = 1

  let taxableIncome: number
  let taxAmount: number
  let effectiveRate: number

  if (type === 'smallProfit') {
    const { threshold, rate, reduction } = taxPolicies.corporateIncome.smallProfitEnterprise

    if (profit <= threshold) {
      taxableIncome = profit * reduction
      taxAmount = taxableIncome * rate
      effectiveRate = rate * reduction
    } else {
      taxableIncome = profit
      taxAmount = profit * taxPolicies.corporateIncome.generalRate
      effectiveRate = taxPolicies.corporateIncome.generalRate
    }

    details.push({
      stepName: '利润总额',
      formula: '',
      value: profit,
      stepOrder: stepOrder++,
    })

    if (profit <= threshold) {
      details.push({
        stepName: '减计应纳税所得额',
        formula: `利润总额 × ${((1 - reduction) * 100).toFixed(0)}%`,
        value: profit * (1 - reduction),
        stepOrder: stepOrder++,
      })

      details.push({
        stepName: '应纳税所得额',
        formula: `利润总额 × ${(reduction * 100).toFixed(0)}%（小型微利企业优惠）`,
        value: taxableIncome,
        stepOrder: stepOrder++,
      })

      details.push({
        stepName: '适用税率',
        formula: `${(rate * 100).toFixed(0)}%（小型微利企业优惠税率）`,
        value: rate,
        stepOrder: stepOrder++,
      })
    } else {
      taxableIncome = profit
      details.push({
        stepName: '应纳税所得额',
        formula: '利润总额（超过小型微利企业标准，不享受优惠）',
        value: taxableIncome,
        stepOrder: stepOrder++,
      })

      details.push({
        stepName: '适用税率',
        formula: `${(taxPolicies.corporateIncome.generalRate * 100).toFixed(0)}%（一般企业税率）`,
        value: taxPolicies.corporateIncome.generalRate,
        stepOrder: stepOrder++,
      })
    }

    details.push({
      stepName: '应纳所得税额',
      formula: `应纳税所得额 × 适用税率`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '实际税负率',
      formula: '',
      value: effectiveRate,
      stepOrder: stepOrder++,
    })
  } else {
    taxableIncome = profit
    taxAmount = profit * taxPolicies.corporateIncome.generalRate
    effectiveRate = taxPolicies.corporateIncome.generalRate

    details.push({
      stepName: '利润总额',
      formula: '',
      value: profit,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳税所得额',
      formula: '',
      value: taxableIncome,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '适用税率',
      formula: `${(taxPolicies.corporateIncome.generalRate * 100).toFixed(0)}%`,
      value: taxPolicies.corporateIncome.generalRate,
      stepOrder: stepOrder++,
    })

    details.push({
      stepName: '应纳所得税额',
      formula: `利润总额 × ${(taxPolicies.corporateIncome.generalRate * 100).toFixed(0)}%`,
      value: taxAmount,
      stepOrder: stepOrder++,
    })
  }

  return {
    taxableIncome,
    taxAmount,
    effectiveRate,
    details,
  }
}

export const calculateOtherTax = (input: OtherTaxInput): OtherTaxResult => {
  const { taxType, baseAmount, rate } = input
  const details: CalculationDetail[] = []
  let stepOrder = 1

  const taxAmount = baseAmount * rate

  const taxNames: Record<string, string> = {
    property: '房产税',
    stamp: '印花税',
    landValue: '土地增值税',
    deed: '契税',
    additional: '城建税及附加',
  }

  details.push({
    stepName: `${taxNames[taxType] || '税费'}计税依据`,
    formula: '',
    value: baseAmount,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '适用税率',
    formula: '',
    value: rate,
    stepOrder: stepOrder++,
  })

  details.push({
    stepName: '应纳税额',
    formula: `计税依据 × 税率`,
    value: taxAmount,
    stepOrder: stepOrder++,
  })

  return {
    taxAmount,
    details,
  }
}

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatPercent = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`
}
