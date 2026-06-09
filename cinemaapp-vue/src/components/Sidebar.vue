<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const menuItems = computed(() => {
  const items = [
    { label: 'Início', path: '/' },
    { label: 'Filmes', path: '/cliente/listar-filmes', role: 'cliente' },
    { label: 'Admin', path: '/admin', role: 'administrador' },
    { label: 'Gerenciar Filmes', path: '/admin/listar-filmes', role: 'administrador' },
    { label: 'Cadastrar Filme', path: '/admin/cadastrar-filme', role: 'administrador' },
    { label: 'Gêneros', path: '/admin/listar-generos', role: 'administrador' },
    { label: 'Assentos', path: '/admin/listar-assentos', role: 'administrador' },
    { label: 'Cadastrar Sala', path: '/admin/cadastrar-sala', role: 'administrador' },
    { label: 'Cadastrar Sessão', path: '/admin/cadastrar-sessao', role: 'administrador' },
    { label: 'Cadastrar Cliente', path: '/admin/cadastrar-usuario?tipo=cliente', role: 'administrador' },
    { label: 'Cadastrar Administrador', path: '/admin/cadastrar-usuario?tipo=administrador', role: 'administrador' },
  ]

  if (auth.user.tipo === 'administrador') {
    return items.filter((item) => item.role !== 'cliente')
  }

  if (auth.user.tipo === 'cliente') {
    return items.filter((item) => item.role !== 'administrador')
  }

  return items.filter((item) => !item.role)
})

async function sair() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="header">
      <div class="logo">🎬</div>
      <strong>CinemaApp</strong>
      <small>Olá, {{ auth.user.nome || 'Usuário' }}!</small>
    </div>

    <nav>
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <button v-if="auth.user.tipo !== 'guest'" @click="sair">
      Sair
    </button>

    <footer>SDM 2026 · Turma ZS-01</footer>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--color-primary);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.logo {
  font-size: 34px;
}

small {
  color: white;
  opacity: 0.9;
}

nav {
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 6px;
}

a {
  color: var(--color-muted-light);
  padding: 12px;
  border-radius: 8px;
}

a.router-link-active {
  background: var(--color-card);
  color: var(--color-primary-light);
}

button {
  margin: 16px;
  margin-top: auto;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
}

footer {
  color: var(--color-muted);
  padding: 16px;
  font-size: 13px;
}
</style>
