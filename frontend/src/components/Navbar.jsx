import { Link, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function Navbar() {
  const { user, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/map" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
        🚀 CareerVerse
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/map" className="text-gray-300 hover:text-white transition-colors text-sm">
          🗺️ Карта
        </Link>
        <Link to="/profile" className="text-gray-300 hover:text-white transition-colors text-sm">
          👤 Профиль
        </Link>
        {user && (
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
            {user.subscription_type === 'premium' ? '⭐ Premium' : 'Free'}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Выйти
        </button>
      </div>
    </nav>
  )
}
