<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Genero } from '@/types'

const generos = ref<Genero[]>([])

const idEditando = ref<number | null>(null)
const nome = ref('')
const descricao = ref('')
const icone = ref('🎬')

const loading = ref(false)
const error = ref('')

async function carregarGeneros() {
  loading.value = true
  error.value = ''

  try {
    generos.value = await api.get<Genero[]>('/generos/')
  } catch {
    error.value = 'Não foi possível carregar os gêneros.'
  } finally {
    loading.value = false
  }
}

function limparFormulario() {
  idEditando.value = null
  nome.value = ''
  descricao.value = ''
  icone.value = '🎬'
}

function editar(genero: Genero) {
  idEditando.value = genero.id
  nome.value = genero.nome
  descricao.value = genero.descricao
  icone.value = genero.icone
}

async function salvar() {
  error.value = ''

  if (!nome.value) {
    error.value = 'Informe o nome do gênero.'
    return
  }

  const payload = {
    nome: nome.value,
    descricao: descricao.value,
    icone: icone.value.trim() || '🎬',
  }

  try {
    if (idEditando.value) {
      await api.patch(`/generos/${idEditando.value}/`, payload)
    } else {
      await api.post('/generos/', payload)
    }

    limparFormulario()
    await carregarGeneros()
  } catch {
    error.value = 'Não foi possível salvar o gênero.'
  }
}

async function excluir(id: number) {
  const confirmar = confirm('Deseja excluir este gênero?')

  if (!confirmar) {
    return
  }

  try {
    await api.delete(`/generos/${id}/`)
    await carregarGeneros()
  } catch {
    alert('Não foi possível excluir o gênero.')
  }
}

onMounted(carregarGeneros)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Gêneros</h1>
      <p class="page-subtitle">Cadastre e gerencie os gêneros dos filmes.</p>

      <AppCard class="form-card">
        <h2>{{ idEditando ? 'Editar Gênero' : 'Cadastrar Gênero' }}</h2>

        <form class="form" @submit.prevent="salvar">
          <AppInput v-model="nome" label="Nome" />
          <AppInput v-model="descricao" label="Descrição" />
          <AppInput v-model="icone" label="Ícone" />

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

      <div v-else class="grid">
        <AppCard
          v-for="genero in generos"
          :key="genero.id"
        >
          <h2>{{ genero.icone }} {{ genero.nome }}</h2>
          <p>{{ genero.descricao }}</p>

          <div class="actions">
            <AppButton variant="secondary" @click="editar(genero)">
              Editar
            </AppButton>

            <AppButton variant="danger" @click="excluir(genero.id)">
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
}
</style>