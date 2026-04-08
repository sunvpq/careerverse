import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  initFromStorage: () => {
    const token = localStorage.getItem('token')
    if (token) set({ token })
  }
}))

export default useStore
