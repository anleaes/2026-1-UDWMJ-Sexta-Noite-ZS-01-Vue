<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const senha = ref('')
const loading = ref(false)
const error = ref('')

async function entrar() {
  error.value = ''
  loading.value = true

  try {
    const user = await auth.login(email.value, senha.value)

    if (user.tipo === 'administrador') {
      router.push('/admin')
    } else {
      router.push('/cliente/listar-filmes')
    }
  } catch (err) {
    error.value = 'Não foi possível entrar. Verifique e-mail e senha.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page login-page">
    <AppCard class="login-card">
      <h1>Entrar</h1>
      <p>Acesse sua conta do CinemaApp.</p>

      <form class="form" @submit.prevent="entrar">
        <AppInput
          v-model="email"
          label="E-mail"
          type="email"
          placeholder="Digite seu e-mail"
        />

        <AppInput
          v-model="senha"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </AppButton>
      </form>

      <RouterLink to="/register">
        Ainda não tem conta? Cadastre-se
      </RouterLink>
    </AppCard>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  place-items: center;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

h1 {
  color: var(--color-primary-light);
  margin-top: 0;
}

p {
  color: var(--color-muted-light);
}

a {
  display: inline-block;
  color: var(--color-primary-light);
  margin-top: 16px;
}
</style>