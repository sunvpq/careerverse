import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from './store/useStore'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import WorldMapPage from './pages/WorldMapPage'
import ProfessionListPage from './pages/ProfessionListPage'
import ProfessionPage from './pages/ProfessionPage'
import LevelPage from './pages/LevelPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const { initFromStorage } = useStore()

  useEffect(() => {
    initFromStorage()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/map" element={<ProtectedRoute><WorldMapPage /></ProtectedRoute>} />
        <Route path="/zone/:id" element={<ProtectedRoute><ProfessionListPage /></ProtectedRoute>} />
        <Route path="/profession/:id" element={<ProtectedRoute><ProfessionPage /></ProtectedRoute>} />
        <Route path="/level/:id" element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
