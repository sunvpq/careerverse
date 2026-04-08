import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getZones } from '../api/zones'
import Navbar from '../components/Navbar'

export default function WorldMapPage() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getZones()
      .then(res => setZones(res.data))
      .catch(() => setError('Не удалось загрузить зоны'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">🗺️ Карта мира профессий</h1>
          <p className="text-gray-400">Выбери зону и начни исследовать карьеры</p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce">🚀</div>
            <p className="text-gray-400 mt-3">Загружаем карту...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map(zone => (
            <div
              key={zone.id}
              onClick={() => !zone.is_locked_free && navigate(`/zone/${zone.id}`)}
              className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                zone.is_locked_free
                  ? 'border-gray-700 bg-gray-900/50 opacity-60 cursor-not-allowed'
                  : 'border-gray-700 bg-gray-900 hover:border-blue-500 hover:scale-105'
              }`}
              style={!zone.is_locked_free ? { borderColor: zone.color_code + '40' } : {}}
            >
              {zone.is_locked_free && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  Premium
                </div>
              )}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: zone.color_code + '20', border: `2px solid ${zone.color_code}40` }}
                >
                  {zone.is_locked_free ? '🔒' : zone.icon_emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{zone.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {zone.is_locked_free ? 'Доступно только для Premium' : 'Нажми для изучения →'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
