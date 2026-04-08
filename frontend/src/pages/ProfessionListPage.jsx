import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfessions } from '../api/professions'
import Navbar from '../components/Navbar'

export default function ProfessionListPage() {
  const { id: zoneId } = useParams()
  const [professions, setProfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getProfessions(zoneId)
      .then(res => setProfessions(res.data))
      .catch(() => setError('Не удалось загрузить профессии'))
      .finally(() => setLoading(false))
  }, [zoneId])

  const renderStars = (difficulty) => '⭐'.repeat(difficulty) + '☆'.repeat(5 - difficulty)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/map')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          ← Назад на карту
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">Профессии зоны</h1>
        <p className="text-gray-400 mb-8">Выбери профессию для изучения</p>

        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce">💼</div>
            <p className="text-gray-400 mt-3">Загружаем профессии...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {professions.map(profession => (
            <div
              key={profession.id}
              onClick={() => !profession.is_locked && navigate(`/profession/${profession.id}`)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex items-center gap-4 ${
                profession.is_locked
                  ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 bg-gray-900 hover:border-blue-500 hover:bg-gray-800'
              }`}
            >
              <div className="text-5xl w-16 text-center flex-shrink-0">
                {profession.is_locked ? '🔒' : profession.chibi_emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{profession.name}</h2>
                <div className="text-sm mt-1 text-yellow-400">{renderStars(profession.difficulty)}</div>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{profession.description}</p>
              </div>
              {profession.is_locked ? (
                <div className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 rounded-full flex-shrink-0">
                  Premium
                </div>
              ) : (
                <div className="text-gray-500">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
