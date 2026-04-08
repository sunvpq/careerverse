import { useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import { getMyProgress } from '../api/progress'
import { upgrade } from '../api/subscription'
import useStore from '../store/useStore'
import Navbar from '../components/Navbar'
import PaywallModal from '../components/PaywallModal'

export default function ProfilePage() {
  const { user, setUser } = useStore()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getMe().then(r => { setUser(r.data); return r.data }),
      getMyProgress().catch(() => null)
    ]).then(([_, prog]) => {
      setProgress(prog?.data || null)
    }).finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async () => {
    setUpgrading(true)
    setError('')
    try {
      const res = await upgrade()
      setUser(res.data)
    } catch {
      setError('Ошибка при обновлении')
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-4xl animate-bounce">👤</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgraded={() => { setShowPaywall(false); window.location.reload() }}
        />
      )}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">👤 Мой профиль</h1>

        {/* User card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold">{user?.email}</p>
              <p className="text-gray-400 text-sm">Возраст: {user?.age} лет</p>
              <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                user?.subscription_type === 'premium'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {user?.subscription_type === 'premium' ? '⭐ Premium' : 'Free Plan'}
              </span>
            </div>
          </div>

          {progress && (
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Всего XP заработано</p>
              <p className="text-3xl font-bold text-blue-400">{progress.total_xp} XP</p>
            </div>
          )}
        </div>

        {/* Progress per profession */}
        {progress?.professions?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">📊 Прогресс по профессиям</h2>
            <div className="space-y-3">
              {progress.professions.map(p => (
                <div key={p.profession_id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Профессия #{p.profession_id}</span>
                    <span className="text-blue-400 font-bold text-sm">{p.xp} XP</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Пройдено уровней: {p.completed_levels.length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade section */}
        {user?.subscription_type !== 'premium' && (
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">⭐ Upgrade to Premium</h2>
            <p className="text-gray-400 text-sm mb-4">
              Получи доступ ко всем зонам, профессиям и неограниченным уровням
            </p>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm mb-3">
                {error}
              </div>
            )}
            <button
              onClick={() => setShowPaywall(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-colors"
            >
              🚀 Upgrade сейчас
            </button>
          </div>
        )}

        {user?.subscription_type === 'premium' && (
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h2 className="text-xl font-bold text-green-400">У тебя Premium!</h2>
            <p className="text-gray-400 text-sm mt-1">Все возможности платформы доступны</p>
          </div>
        )}
      </div>
    </div>
  )
}
