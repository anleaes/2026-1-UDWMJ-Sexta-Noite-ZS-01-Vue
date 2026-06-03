<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '@/services/api'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'

const router = useRouter()

const nome = ref('')
const cpf = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const confirmarSenha = ref('')

const loading = ref(false)
const error = ref('')
const success = ref('')

async function cadastrar() {
  error.value = ''
  success.value = ''

  if (senha.value !== confirmarSenha.value) {
    error.value = 'As senhas não conferem.'
    return
  }

  loading.value = true

  try {
    await api.post('/clientes/clientes/', {
      nome: nome.value,
      cpf: cpf.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value,
    })

    success.value = 'Cadastro realizado com sucesso.'

    setTimeout(() => {
      router.push('/login')
    }, 800)
  } catch {
    error.value = 'Não foi possível cadastrar o usuário.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page register-page">
    <AppCard class="register-card">
      <h1>Cadastro</h1>
      <p>Crie sua conta como cliente.</p>

      <form class="form" @submit.prevent="cadastrar">
        <AppInput v-model="nome" label="Nome completo" />
        <AppInput v-model="cpf" label="CPF" />
        <AppInput v-model="email" label="E-mail" type="email" />
        <AppInput v-model="telefone" label="Telefone" />
        <AppInput v-model="senha" label="Senha" type="password" />
        <AppInput v-model="confirmarSenha" label="Confirmar senha" type="password" />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </AppButton>
      </form>

      <RouterLink to="/login">
        Já tem conta? Entrar
      </RouterLink>
    </AppCard>
  </main>
</template>

<style scoped>
.register-page {
  display: grid;
  place-items: center;
}

.register-card {
  width: 100%;
  max-width: 520px;
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