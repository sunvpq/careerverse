import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfession } from '../api/professions'
import { getLevels } from '../api/levels'
import { getProfessionProgress } from '../api/progress'
import Navbar from '../components/Navbar'

export default function ProfessionPage() {
  const { id } = useParams()
  const [profession, setProfession] = useState(null)
  const [levels, setLevels] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      getProfession(id),
      getLevels(id),
      getProfessionProgress(id).catch(() => null)
    ]).then(([profRes, levelsRes, progressRes]) => {
      setProfession(profRes.data)
      setLevels(levelsRes.data)
      setProgress(progressRes?.data || null)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-4xl animate-bounce">💻</div>
    </div>
  )

  if (!profession) return null

  const completedLevels = progress?.completed_levels || []

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          ← Назад
        </button>

        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{profession.chibi_emoji}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profession.name}</h1>
              <p className="text-gray-400 mt-2 text-sm">{profession.description}</p>
              {profession.characters?.length > 0 && (
                <p className="text-blue-400 text-sm mt-1">
                  Наставник: {profession.characters[0].name}
                </p>
              )}
            </div>
          </div>
          {progress && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((completedLevels.length / levels.length) * 100, 100)}%` }}
                />
              </div>
              <span className="text-blue-400 font-bold text-sm">{progress.xp} XP</span>
            </div>
          )}
        </div>

        {/* Levels */}
        <h2 className="text-xl font-bold text-white mb-4">Уровни</h2>
        <div className="space-y-3">
          {levels.map((level, i) => {
            const isCompleted = completedLevels.includes(level.id)
            const isLocked = level.is_locked

            return (
              <div
                key={level.id}
                onClick={() => !isLocked && navigate(`/level/${level.id}`)}
                className={`rounded-xl p-4 border flex items-center gap-4 cursor-pointer transition-all ${
                  isLocked
                    ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
                    : isCompleted
                    ? 'border-green-700 bg-green-900/20 hover:bg-green-900/30'
                    : 'border-gray-700 bg-gray-900 hover:border-blue-500 hover:bg-gray-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isLocked ? 'bg-gray-800 text-gray-500' :
                  isCompleted ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isLocked ? '🔒' : isCompleted ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{level.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    level.type === 'quiz' ? 'bg-blue-900/50 text-blue-300' :
                    level.type === 'choice' ? 'bg-purple-900/50 text-purple-300' :
                    'bg-orange-900/50 text-orange-300'
                  }`}>
                    {level.type === 'quiz' ? '📝 Квиз' : level.type === 'choice' ? '🎯 Выбор' : '⏱️ На время'}
                  </span>
                </div>
                {isCompleted && <span className="text-green-400 text-sm">+50 XP</span>}
                {isLocked && <span className="text-yellow-500 text-xs">Premium</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
