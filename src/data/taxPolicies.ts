import type { TaxPolicy, TaxTypeInfo, PolicyNotice } from '../types'

export const taxPolicies: TaxPolicy = {
  personalIncome: {
    brackets: [
      { min: 0, max: 3000, rate: 0.03, deduction: 0 },
      { min: 3000, max: 12000, rate: 0.10, deduction: 210 },
      { min: 12000, max: 25000, rate: 0.20, deduction: 1410 },
      { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
      { min: 35000, max: 55000, rate: 0.30, deduction: 4410 },
      { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
      { min: 80000, max: null, rate: 0.45, deduction: 15160 },
    ],
    standardDeduction: 5000,
    effectiveDate: '2024-01-01',
  },
  vat: {
    generalRates: [
      { rate: 0.13, description: '一般纳税人 - 货物销售' },
      { rate: 0.09, description: '一般纳税人 - 交通运输、建筑' },
      { rate: 0.06, description: '一般纳税人 - 服务、无形资产' },
    ],
    specialRates: [
      { rate: 0.03, description: '小规模纳税人' },
      { rate: 0.05, description: '不动产销售、租赁' },
    ],
    effectiveDate: '2024-01-01',
  },
  corporateIncome: {
    generalRate: 0.25,
    smallProfitEnterprise: {
      threshold: 3000000,
      rate: 0.20,
      reduction: 0.25,
      effectiveDate: '2023-01-01',
      expireDate: '2027-12-31',
    },
    effectiveDate: '2024-01-01',
  },
  additional: {
    urbanMaintenance: [
      { rate: 0.07, area: '市区' },
      { rate: 0.05, area: '县城、镇' },
      { rate: 0.01, area: '其他' },
    ],
    educationSurcharge: 0.03,
    localEducationSurcharge: 0.02,
    effectiveDate: '2024-01-01',
  },
  otherTaxes: [
    {
      taxType: 'property',
      rates: [
        { rate: 0.012, description: '从价计征（按房产余值）' },
        { rate: 0.012, description: '从租计征（按租金收入）' },
      ],
    },
    {
      taxType: 'stamp',
      rates: [
        { rate: 0.0005, description: '借款合同' },
        { rate: 0.0003, description: '购销合同、建筑安装工程承包合同' },
        { rate: 0.001, description: '加工承揽合同、财产租赁合同' },
        { rate: 0.0005, description: '货物运输合同、产权转移书据' },
        { rate: 0.00005, description: '权利、许可证照' },
      ],
    },
    {
      taxType: 'landValue',
      rates: [
        { rate: 0.3, description: '增值额未超过扣除项目金额50%' },
        { rate: 0.4, description: '增值额超过扣除项目金额50%，未超过100%' },
        { rate: 0.5, description: '增值额超过扣除项目金额100%，未超过200%' },
        { rate: 0.6, description: '增值额超过扣除项目金额200%' },
      ],
    },
    {
      taxType: 'deed',
      rates: [
        { rate: 0.0005, description: '住宅' },
        { rate: 0.003, description: '非住宅' },
      ],
    },
  ],
}

export const taxTypes: TaxTypeInfo[] = [
  { id: 'personal', name: '个人所得税', icon: 'User', description: '工资薪金、年终奖、劳务报酬等', route: '/tax/personal' },
  { id: 'vat', name: '增值税', icon: 'DollarSign', description: '含税/不含税金额计算', route: '/tax/vat' },
  { id: 'corporate', name: '企业所得税', icon: 'Building', description: '一般企业/小型微利企业', route: '/tax/corporate' },
  { id: 'property', name: '房产税', icon: 'Home', description: '从价/从租计征', route: '/tax/other?type=property' },
  { id: 'stamp', name: '印花税', icon: 'FileText', description: '各类合同、凭证', route: '/tax/other?type=stamp' },
  { id: 'additional', name: '城建税及附加', icon: 'Layers', description: '城建税、教育费附加', route: '/tax/other?type=additional' },
  { id: 'landValue', name: '土地增值税', icon: 'Map', description: '四级超率累进税率', route: '/tax/other?type=landValue' },
  { id: 'deed', name: '契税', icon: 'Receipt', description: '不动产交易', route: '/tax/other?type=deed' },
  { id: 'other', name: '更多税种', icon: 'MoreHorizontal', description: '其他税费计算', route: '/tax/other' },
]

export const policyNotices: PolicyNotice[] = [
  {
    id: '1',
    title: '关于小型微利企业所得税优惠政策延续的公告',
    date: '2024-04-26',
    tag: '最新',
  },
  {
    id: '2',
    title: '个人所得税专项附加扣除标准（2024年）',
    date: '2024-04-20',
    tag: '政策',
  },
  {
    id: '3',
    title: '增值税税率调整通知',
    date: '2024-03-15',
    tag: '政策',
  },
  {
    id: '4',
    title: '房产税计税依据调整说明',
    date: '2024-02-28',
    tag: '通知',
  },
]

export const personalTaxSubtypes = [
  { id: 'salary', name: '工资薪金' },
  { id: 'yearlyBonus', name: '全年奖' },
  { id: 'serviceFee', name: '劳务报酬' },
  { id: 'royalty', name: '特许权使用费' },
  { id: 'copyright', name: '稿酬所得' },
]
