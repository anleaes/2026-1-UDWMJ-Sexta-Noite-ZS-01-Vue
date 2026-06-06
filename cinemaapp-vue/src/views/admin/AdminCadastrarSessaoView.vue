<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Sessao, Filme, Sala } from '@/types'

const sessoes = ref<Sessao[]>([])
const filmes = ref<Filme[]>([])
const salas = ref<Sala[]>([])

const idEditando = ref<number | null>(null)
const filmeId = ref<number | ''>('')
const salaId = ref<number | ''>('')
const horario = ref('')
const ativa = ref(true)

const loading = ref(false)
const error = ref('')

async function carregarDados() {
  loading.value = true
  error.value = ''

  try {
    // Carrega sessões, filmes e salas ao mesmo tempo
    const [sessoesRes, filmesRes, salasRes] = await Promise.all([
      api.get<Sessao[]>('/sessoes/'),
      api.get<Filme[]>('/filmes/'),
      api.get<Sala[]>('/salas/')
    ])
    
    sessoes.value = sessoesRes
    filmes.value = filmesRes
    salas.value = salasRes
  } catch {
    error.value = 'Não foi possível carregar os dados das sessões.'
  } finally {
    loading.value = false
  }
}

function limparFormulario() {
  idEditando.value = null
  filmeId.value = ''
  salaId.value = ''
  horario.value = ''
  ativa.value = true
  error.value = ''
}

function editar(sessao: Sessao) {
  idEditando.value = sessao.id
  filmeId.value = sessao.filme
  salaId.value = sessao.sala
  
  
  horario.value = sessao.horario.slice(0, 16) 
  
  ativa.value = sessao.ativa
}

async function salvar() {
  error.value = ''

  if (!filmeId.value || !salaId.value || !horario.value) {
    error.value = 'Preencha os campos de filme, sala e horário.'
    return
  }

  const payload = {
    filme: filmeId.value,
    sala: salaId.value,
    horario: horario.value,
    ativa: ativa.value,
  }

  try {
    if (idEditando.value) {
      await api.patch(`/sessoes/${idEditando.value}/`, payload)
    } else {
      await api.post('/sessoes/', payload)
    }

    limparFormulario()
    await carregarDados()
  } catch {
    error.value = 'Não foi possível salvar a sessão.'
  }
}

async function excluir(id: number) {
  const confirmar = confirm('Deseja excluir esta sessão?')

  if (!confirmar) {
    return
  }

  try {
    await api.delete(`/sessoes/${id}/`)
    await carregarDados()
  } catch {
    alert('Não foi possível excluir a sessão.')
  }
}

function getFilmeTitulo(id: number) {
  return filmes.value.find(f => f.id === id)?.titulo || 'Filme não encontrado'
}

function getSalaNome(id: number) {
  return salas.value.find(s => s.id === id)?.nome || 'Sala não encontrada'
}

function formatarDataHora(dataISO: string) {
  return new Date(dataISO).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(carregarDados)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Sessões</h1>
      <p class="page-subtitle">Cadastre e gerencie os horários dos filmes nas salas.</p>

      <AppCard class="form-card">
        <h2>{{ idEditando ? 'Editar Sessão' : 'Cadastrar Sessão' }}</h2>

        <form class="form" @submit.prevent="salvar">
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
            <span>Sessão Ativa (Visível para o cliente)</span>
          </label>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="actions">
            <AppButton type="submit">
              {{ idEditando ? 'Salvar Alterações' : 'Cadastrar' }}
            </AppButton>

            <AppButton
              v-if="idEditando"
              variant="secondary"
              @click="limparFormulario"
            >
              Cancelar edição
            </AppButton>
          </div>
        </form>
      </AppCard>

      <LoadingSpinner v-if="loading" />
      <div v-else-if="sessoes.length === 0" class="empty">
        Nenhuma sessão cadastrada.
      </div>
      <div v-else class="grid">
        <AppCard
          v-for="sessao in sessoes"
          :key="sessao.id"
        >
          <div class="status-badge" :class="{ 'inativa': !sessao.ativa }">
            {{ sessao.ativa ? 'Ativa' : 'Inativa' }}
          </div>
          
          <h2>🎬 {{ getFilmeTitulo(sessao.filme) }}</h2>
          <p><strong>Sala:</strong> {{ getSalaNome(sessao.sala) }}</p>
          <p><strong>Horário:</strong> {{ formatarDataHora(sessao.horario) }}</p>

          <div class="actions">
            <AppButton variant="secondary" @click="editar(sessao)">
              Editar
            </AppButton>

            <AppButton variant="danger" @click="excluir(sessao.id)">
              Excluir
            </AppButton>
          </div>
        </AppCard>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.form-card {
  margin-bottom: 24px;
}

h2 {
  color: var(--color-primary-light);
  margin-top: 0;
}

p {
  color: var(--color-muted-light);
  margin: 4px 0;
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

.empty {
  color: var(--color-muted-light);
  border: 1px dashed var(--color-border-soft);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: #2d6a2d;
  color: #fff;
  margin-bottom: 12px;
}

.status-badge.inativa {
  background-color: #6a2d2d;
}
</style>