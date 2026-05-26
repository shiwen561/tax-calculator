import { ArrowLeft, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBack?: boolean
  showShare?: boolean
  onShare?: () => void
}

export default function Header({ title, showBack = true, showShare = false, onShare }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-12 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>
        {showShare && (
          <button
            onClick={onShare}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  )
}
