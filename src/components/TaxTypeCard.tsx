import { User, DollarSign, Building, Home, FileText, Layers, Map, Receipt, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { TaxTypeInfo } from '../types'

const iconMap: Record<string, typeof User> = {
  User,
  DollarSign,
  Building,
  Home,
  FileText,
  Layers,
  Map,
  Receipt,
  MoreHorizontal,
}

const colorMap: Record<string, string> = {
  personal: 'bg-red-500',
  vat: 'bg-yellow-500',
  corporate: 'bg-blue-500',
  property: 'bg-green-500',
  stamp: 'bg-purple-500',
  additional: 'bg-orange-500',
  landValue: 'bg-yellow-600',
  deed: 'bg-teal-500',
  other: 'bg-gray-500',
}

interface TaxTypeCardProps {
  tax: TaxTypeInfo
}

export default function TaxTypeCard({ tax }: TaxTypeCardProps) {
  const navigate = useNavigate()
  const Icon = iconMap[tax.icon] || MoreHorizontal

  return (
    <button
      onClick={() => navigate(tax.route)}
      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-full ${colorMap[tax.id] || 'bg-gray-500'} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-sm font-medium text-gray-800">{tax.name}</span>
      <span className="text-xs text-gray-400 mt-1 max-w-full text-center truncate">
        {tax.description}
      </span>
    </button>
  )
}
