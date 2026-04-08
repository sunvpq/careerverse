import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../api/auth'
import useStore from '../store/useStore'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', age: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = mode === 'register'
        ? { email: form.email, password: form.password, age: parseInt(form.age) }
        : { email: form.email, password: form.password }

      const fn = mode === 'register' ? register : login
      const res = await fn(payload)
      setAuth(res.data.user, res.data.access_token)
      navigate('/map')
    } catch (e) {
      const msg = e.response?.data?.detail
      if (msg === 'Email already registered') setError('Email уже зарегистрирован')
      else if (msg === 'Invalid credentials') setError('Неверный email или пароль')
      else setError('Что-то пошло не так. Попробуй ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="text-3xl font-bold text-white">CareerVerse</h1>
          <p className="text-gray-400 mt-2">Исследуй профессии будущего</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Пароль</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Возраст</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  min={13}
                  max={19}
                  placeholder="15"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? '...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-500">
            <p className="font-medium text-gray-400 mb-1">Тестовые данные:</p>
            <p>Email: test@careerverse.kz</p>
            <p>Пароль: test1234</p>
          </div>
        </div>
      </div>
    </div>
  )
}
