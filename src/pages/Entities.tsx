import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import Header from '../components/Header'
import { useStore } from '../store'
import type { Entity } from '../types'

export default function Entities() {
  const entities = useStore((state) => state.entities)
  const addEntity = useStore((state) => state.addEntity)
  const updateEntity = useStore((state) => state.updateEntity)
  const removeEntity = useStore((state) => state.removeEntity)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
  })

  const handleOpenModal = (entity?: Entity) => {
    if (entity) {
      setEditingEntity(entity)
      setFormData({
        name: entity.name,
        taxId: entity.taxId,
      })
    } else {
      setEditingEntity(null)
      setFormData({
        name: '',
        taxId: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntity(null)
    setFormData({ name: '', taxId: '' })
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入主体名称')
      return
    }

    if (editingEntity) {
      updateEntity(editingEntity.id, {
        name: formData.name,
        taxId: formData.taxId,
      })
    } else {
      addEntity({
        name: formData.name,
        taxId: formData.taxId,
        defaultSettings: {},
      })
    }

    handleCloseModal()
  }

  const handleDelete = (entity: Entity) => {
    if (confirm(`确定删除主体「${entity.name}」吗？`)) {
      removeEntity(entity.id)
    }
  }

  return (
    <div className="min-h-screen bg-bgLight pb-20">
      <Header title="常用主体" />

      <div className="px-4 py-4">
        <button
          onClick={() => handleOpenModal()}
          className="w-full mb-4 py-4 bg-white rounded-xl shadow-card flex items-center justify-center gap-2 text-primary font-medium"
        >
          <Plus size={20} />
          <span>添加常用主体</span>
        </button>

        {entities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">暂无常用主体</p>
            <p className="text-xs text-gray-400 mt-1">添加主体后可快速应用默认配置</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="bg-white rounded-xl shadow-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{entity.name}</h3>
                    {entity.taxId && (
                      <p className="text-sm text-gray-400 mt-1">{entity.taxId}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(entity)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(entity)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-error hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">常用主体说明</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 可预设不同企业的常用税费计算模板</li>
            <li>• 保存纳税人名称和纳税人识别号</li>
            <li>• 支持快速应用到计算表单</li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">
                {editingEntity ? '编辑主体' : '添加主体'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主体名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入企业名称"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  纳税人识别号
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, taxId: e.target.value }))}
                  placeholder="请输入纳税人识别号"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-primary to-primaryDark text-white font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <Check size={18} />
                <span>{editingEntity ? '保存修改' : '添加主体'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
