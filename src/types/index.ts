export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  deduction: number
}

export interface PersonalTaxPolicy {
  brackets: TaxBracket[]
  standardDeduction: number
  effectiveDate: string
}

export interface VatRate {
  rate: number
  description: string
}

export interface VatPolicy {
  generalRates: VatRate[]
  specialRates: VatRate[]
  effectiveDate: string
}

export interface CorporateTaxPolicy {
  generalRate: number
  smallProfitEnterprise: {
    threshold: number
    rate: number
    reduction: number
    effectiveDate: string
    expireDate: string
  }
  effectiveDate: string
}

export interface AdditionalTaxPolicy {
  urbanMaintenance: { rate: number; area: string }[]
  educationSurcharge: number
  localEducationSurcharge: number
  effectiveDate: string
}

export interface OtherTaxRate {
  taxType: string
  rates: { rate: number; description: string }[]
}

export interface TaxPolicy {
  personalIncome: PersonalTaxPolicy
  vat: VatPolicy
  corporateIncome: CorporateTaxPolicy
  additional: AdditionalTaxPolicy
  otherTaxes: OtherTaxRate[]
}

export interface PersonalTaxInput {
  type: 'salary' | 'yearlyBonus' | 'serviceFee' | 'royalty' | 'copyright'
  income: number
  socialInsurance: number
  housingFund: number
  specialDeductions: number
  otherDeductions: number
}

export interface PersonalTaxResult {
  taxableIncome: number
  taxAmount: number
  taxRate: number
  deduction: number
  netIncome: number
  details: CalculationDetail[]
}

export interface VatInput {
  amountType: 'taxIncluded' | 'taxExcluded'
  amount: number
  rate: number
  urbanMaintenanceRate: number
}

export interface VatResult {
  taxExcludedAmount: number
  vatAmount: number
  urbanMaintenanceAmount: number
  educationSurchargeAmount: number
  localEducationSurchargeAmount: number
  totalAmount: number
  details: CalculationDetail[]
}

export interface CorporateTaxInput {
  type: 'general' | 'smallProfit'
  profit: number
}

export interface CorporateTaxResult {
  taxableIncome: number
  taxAmount: number
  effectiveRate: number
  details: CalculationDetail[]
}

export interface OtherTaxInput {
  taxType: string
  baseAmount: number
  rate: number
}

export interface OtherTaxResult {
  taxAmount: number
  details: CalculationDetail[]
}

export interface CalculationDetail {
  stepName: string
  formula: string
  value: number
  stepOrder: number
}

export interface CalculationRecord {
  id: string
  taxType: string
  taxSubtype: string
  inputData: Record<string, unknown>
  resultData: Record<string, unknown>
  entityName?: string
  createdAt: string
}

export interface Entity {
  id: string
  name: string
  taxId: string
  defaultSettings: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  nickname: string
  avatarUrl: string
  createdAt: string
}

export interface TaxTypeInfo {
  id: string
  name: string
  icon: string
  description: string
  route: string
}

export interface PolicyNotice {
  id: string
  title: string
  date: string
  tag: string
}
