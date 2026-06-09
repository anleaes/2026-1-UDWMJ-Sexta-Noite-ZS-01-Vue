import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { AuthUser, UserTipo } from '@/types'

type AuthUserWithId = AuthUser & { id?: number }

const STORAGE_KEY = 'cinemaapp_user'

type LoginResponse = {
  success?: boolean
  detail?: string
  token?: string
  tipo?: string
  usuario_tipo?: string
  usuario?: {
    id?: number 
    tipo?: string
    nome?: string
    email?: string
  }
}

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

function normalizeTipo(value: unknown): UserTipo {
  const tipo = String(value ?? 'cliente').toLowerCase()

  return tipo === 'administrador' ? 'administrador' : 'cliente'
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
    setUser(user: AuthUserWithId) {
      this.user = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    },

    async login(email: string, senha: string) {
      const data = (await api.login(email, senha)) as LoginResponse

      if (!data?.success) {
        throw new Error(data?.detail || 'Login nao autorizado')
      }

      const userData = data.usuario ?? {}
      const tipo = normalizeTipo(userData.tipo ?? data.usuario_tipo ?? data.tipo)

      this.setUser({
        id: userData.id, 
        tipo,
        nome: userData.nome,
        email: userData.email ?? email.trim(),
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