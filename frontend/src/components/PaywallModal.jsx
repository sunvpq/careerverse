import { useState } from 'react'
import { upgrade } from '../api/subscription'
import useStore from '../store/useStore'

export default function PaywallModal({ onClose, onUpgraded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useStore()

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await upgrade()
      setUser(res.data)
      onUpgraded && onUpgraded()
      onClose()
    } catch (e) {
      setError('Ошибка при обновлении. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">⭐</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">CareerVerse Premium</h2>
          <p className="text-gray-400">Разблокируй весь потенциал платформы</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            '✅ Все зоны и профессии',
            '✅ Неограниченные уровни',
            '✅ Эксклюзивные карьерные пути',
            '✅ Детальная аналитика прогресса',
            '✅ Приоритетная поддержка',
          ].map((benefit, i) => (
            <div key={i} className="text-gray-300 text-sm">{benefit}</div>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-600 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors text-sm"
          >
            Не сейчас
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Обновляем...' : '🚀 Upgrade бесплатно'}
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-3">MVP демо — без реальной оплаты</p>
      </div>
    </div>
  )
}
