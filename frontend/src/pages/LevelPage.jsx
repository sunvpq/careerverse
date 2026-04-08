import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getLevel, submitAnswer } from '../api/levels'
import Navbar from '../components/Navbar'
import PaywallModal from '../components/PaywallModal'

export default function LevelPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [level, setLevel] = useState(null)
  const [step, setStep] = useState('teach') // 'teach' | 'quiz' | 'result'
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [timer, setTimer] = useState(30)
  const timerRef = useRef(null)

  useEffect(() => {
    getLevel(id)
      .then(res => setLevel(res.data))
      .catch(e => {
        if (e.response?.data?.detail === 'premium_required') {
          setShowPaywall(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (step === 'quiz' && level?.type === 'timed') {
      setTimer(30)
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            handleSubmit(selected)
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [step])

  const handleSubmit = async (answer) => {
    if (submitting) return
    const ans = answer ?? selected
    if (!ans) return
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const res = await submitAnswer(id, ans)
      setResult(res.data)
      setStep('result')
    } catch (e) {
      if (e.response?.data?.detail === 'premium_required') {
        setShowPaywall(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-4xl animate-bounce">📚</div>
    </div>
  )

  if (showPaywall) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <PaywallModal
        onClose={() => navigate(-1)}
        onUpgraded={() => { setShowPaywall(false); window.location.reload() }}
      />
    </div>
  )

  if (!level) return null

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 transition-colors">
          ← Назад
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              level.type === 'quiz' ? 'bg-blue-900/50 text-blue-300' :
              level.type === 'choice' ? 'bg-purple-900/50 text-purple-300' :
              'bg-orange-900/50 text-orange-300'
            }`}>
              {level.type === 'quiz' ? '📝 Квиз' : level.type === 'choice' ? '🎯 Выбор' : '⏱️ На время'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{level.title}</h1>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-8">
          {['teach', 'quiz', 'result'].map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${
              s === step ? 'bg-blue-500' :
              ['teach', 'quiz', 'result'].indexOf(step) > i ? 'bg-blue-800' : 'bg-gray-800'
            }`} />
          ))}
        </div>

        {/* TEACH STEP */}
        {step === 'teach' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">📖 Изучи материал</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
              {level.teaching_text}
            </div>
            <button
              onClick={() => setStep('quiz')}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Понял, поехали! →
            </button>
          </div>
        )}

        {/* QUIZ STEP */}
        {step === 'quiz' && level.task && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            {level.type === 'timed' && (
              <div className={`flex items-center justify-between mb-4 ${timer <= 10 ? 'text-red-400' : 'text-orange-400'}`}>
                <span className="text-sm">Время:</span>
                <span className="text-2xl font-bold tabular-nums">{timer}s</span>
              </div>
            )}
            <h2 className="text-lg font-bold text-white mb-6">{level.task.question}</h2>
            <div className="space-y-3">
              {level.task.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(option)}
                  className={`w-full text-left py-3 px-4 rounded-xl border transition-all text-sm ${
                    selected === option
                      ? 'border-blue-500 bg-blue-900/30 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleSubmit(selected)}
              disabled={!selected || submitting}
              className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Проверяем...' : 'Ответить'}
            </button>
          </div>
        )}

        {/* RESULT STEP */}
        {step === 'result' && result && (
          <div className={`rounded-2xl p-6 border ${
            result.correct ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
          }`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{result.correct ? '✅' : '❌'}</div>
              <h2 className="text-2xl font-bold text-white">
                {result.correct ? 'Правильно!' : 'Не совсем...'}
              </h2>
              <div className={`text-lg font-bold mt-2 ${result.correct ? 'text-green-400' : 'text-yellow-400'}`}>
                +{result.xp_earned} XP
              </div>
            </div>

            {!result.correct && (
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-1">Правильный ответ:</p>
                <p className="text-white font-medium">{result.correct_answer}</p>
              </div>
            )}

            <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Объяснение:</p>
              <p className="text-gray-300 text-sm">{result.explanation}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-600 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors text-sm"
              >
                К профессии
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Следующий уровень →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
