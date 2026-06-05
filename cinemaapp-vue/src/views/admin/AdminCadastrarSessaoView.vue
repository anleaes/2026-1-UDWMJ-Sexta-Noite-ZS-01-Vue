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
          
          </AppCard>
      </div>
    </section>
  </AppLayout>
</template>