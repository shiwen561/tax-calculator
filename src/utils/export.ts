import * as XLSX from 'xlsx'

export const exportToExcel = (data: Record<string, unknown>[], filename: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '税务计算明细')

  const colWidths = data[0] ? Object.keys(data[0]).map(() => ({ wch: 20 })) : []
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export const generateReportHtml = (
  title: string,
  inputData: Record<string, unknown>,
  resultData: Record<string, unknown>,
  details: { stepName: string; formula: string; value: number }[]
): string => {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          color: #1E88E5;
          border-bottom: 2px solid #1E88E5;
          padding-bottom: 10px;
        }
        h2 {
          color: #555;
          margin-top: 30px;
        }
        .section {
          margin-bottom: 25px;
        }
        .input-row, .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
        }
        .input-row:first-child, .detail-row:first-child {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .input-row:nth-child(even), .detail-row:nth-child(even) {
          background-color: #fafafa;
        }
        .label {
          flex: 2;
        }
        .value {
          flex: 1;
          text-align: right;
          font-weight: 500;
        }
        .result-box {
          background-color: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
        }
        .result-label {
          font-weight: 500;
        }
        .result-value {
          font-size: 1.2em;
          color: #1E88E5;
        }
        .highlight {
          color: #F44336;
          font-size: 1.4em;
          font-weight: bold;
        }
        .formula {
          font-family: monospace;
          font-size: 0.9em;
          color: #666;
          margin-top: 4px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 0.85em;
          color: #888;
          text-align: center;
        }
        .timestamp {
          font-size: 0.8em;
          color: #999;
        }
      </style>
    </head>
    <body>
      <h1>税务计算明细表</h1>
      <div class="timestamp">计算时间：${new Date().toLocaleString('zh-CN')}</div>
      
      <div class="section">
        <h2>一、计算项目</h2>
        <div class="input-row">
          <span class="label">项目名称</span>
          <span class="value">${title}</span>
        </div>
      </div>

      <div class="section">
        <h2>二、输入参数</h2>
        <div class="input-row">
          <span class="label">参数名称</span>
          <span class="value">数值</span>
        </div>
        ${Object.entries(inputData)
          .map(
            ([key, value]) => `
          <div class="input-row">
            <span class="label">${formatKey(key)}</span>
            <span class="value">${formatValue(value)}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="section">
        <h2>三、计算步骤</h2>
        <div class="detail-row">
          <span class="label">步骤</span>
          <span class="value">金额（元）</span>
        </div>
        ${details
          .map(
            (detail) => `
          <div class="detail-row">
            <span class="label">${detail.stepName}${detail.formula ? `<div class="formula">${detail.formula}</div>` : ''}</span>
            <span class="value">${formatNumber(detail.value)}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="result-box">
        <h2>四、计算结果</h2>
        ${Object.entries(resultData)
          .map(
            ([key, value]) => `
          <div class="result-item">
            <span class="result-label">${formatKey(key)}：</span>
            <span class="result-value ${key.includes('税额') || key.includes('应纳税') ? 'highlight' : ''}">${formatValue(value)}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="footer">
        <p>* 本计算结果仅供参考，具体以税务机关核定为准</p>
        <p>税务计算助手 © 2024</p>
      </div>
    </body>
    </html>
  `
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

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const downloadHtml = (html: string, filename: string): void => {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
