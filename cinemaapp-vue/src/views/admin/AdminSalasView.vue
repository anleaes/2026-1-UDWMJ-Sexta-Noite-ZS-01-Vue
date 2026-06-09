<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Sala } from '@/types'

const salas = ref<Sala[]>([])

const idEditando = ref<number | null>(null)
const numero = ref('')
const capacidade = ref('')
const sala3D = ref(false)

const loading = ref(false)
const error = ref('')
const success = ref('')

const salasOrdenadas = computed(() => {
  return [...salas.value].sort((a, b) => a.numero - b.numero)
})

async function carregarSalas() {
  loading.value = true
  error.value = ''

  try {
    salas.value = await api.get<Sala[]>('/salas/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Não foi possível carregar as salas.'
  } finally {
    loading.value = false
  }
}

function limparFormulario() {
  idEditando.value = null
  numero.value = ''
  capacidade.value = ''
  sala3D.value = false
  error.value = ''
}

function editar(sala: Sala) {
  idEditando.value = sala.id
  numero.value = String(sala.numero)
  capacidade.value = String(sala.capacidade)
  sala3D.value = sala.sala3D
  success.value = ''

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

async function salvar() {
  error.value = ''
  success.value = ''

  if (!numero.value || !capacidade.value) {
    error.value = 'Preencha número e capacidade da sala.'
    return
  }

  const payload = {
    numero: Number(numero.value),
    capacidade: Number(capacidade.value),
    sala3D: sala3D.value,
  }

  try {
    if (idEditando.value) {
      await api.patch(`/salas/${idEditando.value}/`, payload)
    } else {
      await api.post('/salas/', payload)
    }

    limparFormulario()
    success.value = 'Sala salva com sucesso.'
    await carregarSalas()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Não foi possível salvar a sala.'
  }
}

async function excluir(id: number) {
  const confirmar = confirm('Deseja excluir esta sala?')

  if (!confirmar) {
    return
  }

  try {
    await api.delete(`/salas/${id}/`)
    await carregarSalas()
  } catch {
    alert('Não foi possível excluir a sala.')
  }
}

onMounted(carregarSalas)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Salas</h1>
      <p class="page-subtitle">Cadastre e gerencie as salas do cinema.</p>

      <AppCard class="form-card">
        <h2>{{ idEditando ? 'Editar Sala' : 'Cadastrar Sala' }}</h2>

        <form class="form" @submit.prevent="salvar">
          <AppInput v-model="numero" label="Número da sala" type="number" />
          <AppInput v-model="capacidade" label="Capacidade" type="number" />

          <label class="field checkbox-field">
            <input v-model="sala3D" type="checkbox" />
            <span>Sala 3D</span>
          </label>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
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

      <div v-else-if="salasOrdenadas.length === 0" class="empty">
        Nenhuma sala cadastrada.
      </div>

      <div v-else class="grid">
        <AppCard
          v-for="sala in salasOrdenadas"
          :key="sala.id"
        >
          <span class="status" :class="{ tridimensional: sala.sala3D }">
            {{ sala.sala3D ? '3D' : '2D' }}
          </span>

          <h2>Sala {{ sala.numero }}</h2>
          <p>Capacidade: {{ sala.capacidade }} lugares</p>

          <div class="actions">
            <AppButton variant="secondary" @click="editar(sala)">
              Editar
            </AppButton>

              <AppButton variant="danger" @click="excluir(sala.id)">
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

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-muted-light);
}

.checkbox-field {
  flex-direction: row;
  align-items: center;
}

input[type='checkbox'] {
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

.success-message {
  background: var(--color-success);
  color: white;
  border-radius: 10px;
  padding: 12px;
}

.status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 14px;
  font-size: 13px;
  background: var(--color-card);
  color: var(--color-muted-light);
}

.status.tridimensional {
  background: var(--color-success);
  color: white;
}
</style>
