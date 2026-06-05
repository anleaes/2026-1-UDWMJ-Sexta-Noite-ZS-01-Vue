<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Filme, Sala } from '@/types'

const router = useRouter()

const filmes = ref<Filme[]>([])
const salas = ref<Sala[]>([])

const filmeId = ref('')
const salaId = ref('')
const horario = ref('')
const ativa = ref(true)

const loading = ref(false)
const saving = ref(false)
const error = ref('')

async function carregarDados() {
  loading.value = true
  error.value = ''

  try {
    const [filmesRes, salasRes] = await Promise.all([
      api.get<Filme[]>('/filmes/'),
      api.get<Sala[]>('/salas/')
    ])
    
    filmes.value = filmesRes
    salas.value = salasRes
  } catch {
    error.value = 'Não foi possível carregar as listas de filmes e salas.'
  } finally {
    loading.value = false
  }
}

async function salvarSessao() {
  if (!filmeId.value || !salaId.value || !horario.value) {
    error.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  saving.value = true
  error.value = ''

  try {
    await api.post('/sessoes/', {
      filme: filmeId.value,
      sala: salaId.value,
      horario: horario.value,
      ativa: ativa.value
    })

    router.push('/admin') 
  } catch {
    error.value = 'Erro ao cadastrar a sessão. Verifique os dados.'
  } finally {
    saving.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Cadastrar Sessão</h1>
      <p class="page-subtitle">Adicione uma nova sessão ao cinema.</p>

      <LoadingSpinner v-if="loading" />

      <div v-else>
        <AppCard class="form-card">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <form @submit.prevent="salvarSessao">
            <label class="field">
              <span>Filme *</span>
              <select v-model="filmeId" required>
                <option value="" disabled>Selecione um filme</option>
                <option v-for="filme in filmes" :key="filme.id" :value="filme.id">
                  {{ filme.titulo }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>Sala *</span>
              <select v-model="salaId" required>
                <option value="" disabled>Selecione uma sala</option>
                <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                  {{ sala.nome }} (Capacidade: {{ sala.capacidade }})
                </option>
              </select>
            </label>

            <label class="field">
              <span>Data e Horário *</span>
              <input 
                type="datetime-local" 
                v-model="horario" 
                required 
              />
            </label>

            <label class="field checkbox-field">
              <input 
                type="checkbox" 
                v-model="ativa" 
              />
              <span>Sessão Ativa (Visível para compra)</span>
            </label>

            <div class="actions">
              <AppButton type="submit" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Cadastrar Sessão' }}
              </AppButton>
              
              <RouterLink to="/admin">
                <AppButton variant="secondary" type="button">Cancelar</AppButton>
              </RouterLink>
            </div>
          </form>
        </AppCard>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.form-card {
  max-width: 600px;
  margin: 0 auto;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--color-muted-light);
}

.field span {
  font-weight: bold;
}

input[type="datetime-local"],
select {
  background: var(--color-bg-input);
  color: white;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
  font-family: inherit;
  font-size: 16px;
  color-scheme: dark;
}

.checkbox-field {
  flex-direction: row;
  align-items: center;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 30px;
}

.error-message {
  margin-bottom: 20px;
}
</style>