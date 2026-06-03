import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { AuthUser } from '@/types'

const STORAGE_KEY = 'cinemaapp_user'

function getStoredUser(): AuthUser {
  const value = localStorage.getItem(STORAGE_KEY)

  if (!value) {
    return { tipo: 'guest' }
  }

  try {
    return JSON.parse(value)
  } catch {
    return { tipo: 'guest' }
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser() as AuthUser,
  }),

  getters: {
    isGuest: (state) => state.user.tipo === 'guest',
    isCliente: (state) => state.user.tipo === 'cliente',
    isAdmin: (state) => state.user.tipo === 'administrador',
  },

  actions: {
    setUser(user: AuthUser) {
      this.user = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    },

    async login(email: string, senha: string) {
      const data = await api.login(email, senha)

      if (!data.success) {
        throw new Error('Login não autorizado')
      }

      this.setUser({
        tipo: data.usuario.tipo,
        nome: data.usuario.nome,
        email: data.usuario.email,
        token: data.token,
      })

      return this.user
    },

    async logout() {
      await api.logout()
      this.user = { tipo: 'guest' }
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})