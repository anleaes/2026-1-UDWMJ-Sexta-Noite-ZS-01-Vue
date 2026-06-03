<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()

const tipo = computed(() => {
  return route.query.tipo === 'administrador' ? 'administrador' : 'cliente'
})

const titulo = computed(() => {
  return tipo.value === 'administrador'
    ? 'Cadastrar Administrador'
    : 'Cadastrar Cliente'
})

const nome = ref('')
const cpf = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const nivelAcesso = ref('admin')

const loading = ref(false)
const error = ref('')
const success = ref('')

async function cadastrar() {
  error.value = ''
  success.value = ''

  if (!nome.value || !cpf.value || !email.value || !telefone.value || !senha.value) {
    error.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  if (senha.value !== confirmarSenha.value) {
    error.value = 'As senhas não conferem.'
    return
  }

  loading.value = true

  try {
    if (tipo.value === 'administrador') {
      await api.post('/administrador/administrador/', {
        nome: nome.value,
        cpf: cpf.value,
        email: email.value,
        telefone: telefone.value,
        senha: senha.value,
        nivel_acesso: nivelAcesso.value,
      })
    } else {
      await api.post('/clientes/clientes/', {
        nome: nome.value,
        cpf: cpf.value,
        email: email.value,
        telefone: telefone.value,
        senha: senha.value,
      })
    }

    success.value = 'Usuário cadastrado com sucesso.'

    setTimeout(() => {
      router.push('/admin')
    }, 800)
  } catch {
    error.value = 'Não foi possível cadastrar o usuário.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">{{ titulo }}</h1>
      <p class="page-subtitle">
        Cadastre usuários do sistema pela área administrativa.
      </p>

      <AppCard>
        <form class="form" @submit.prevent="cadastrar">
          <AppInput v-model="nome" label="Nome completo" />
          <AppInput v-model="cpf" label="CPF" />
          <AppInput v-model="email" label="E-mail" type="email" />
          <AppInput v-model="telefone" label="Telefone" />
          <AppInput v-model="senha" label="Senha" type="password" />
          <AppInput v-model="confirmarSenha" label="Confirmar senha" type="password" />

          <AppInput
            v-if="tipo === 'administrador'"
            v-model="nivelAcesso"
            label="Nível de acesso"
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <div class="actions">
            <AppButton type="submit" :disabled="loading">
              {{ loading ? 'Cadastrando...' : 'Cadastrar Usuário' }}
            </AppButton>

            <RouterLink to="/admin">
              <AppButton variant="secondary">Cancelar</AppButton>
            </RouterLink>
          </div>
        </form>
      </AppCard>
    </section>
  </AppLayout>
</template>