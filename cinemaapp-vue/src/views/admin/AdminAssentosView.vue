<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Assento, Sala } from '@/types'

const assentos = ref<Assento[]>([])
const salas = ref<Sala[]>([])

const salaId = ref('')
const numero = ref('')
const fila = ref('')

const loading = ref(false)
const error = ref('')

const assentosOrdenados = computed(() => {
  return [...assentos.value].sort((a, b) => {
    if (a.fila === b.fila) {
      return a.numero - b.numero
    }

    return a.fila.localeCompare(b.fila)
  })
})

async function carregarDados() {
  loading.value = true
  error.value = ''

  try {
    const [assentosRes, salasRes] = await Promise.all([
      api.get<Assento[]>('/assentos/assentos/'),
      api.get<Sala[]>('/salas/'),
    ])

    assentos.value = assentosRes
    salas.value = salasRes
  } catch {
    error.value = 'Não foi possível carregar os dados dos assentos.'
  } finally {
    loading.value = false
  }
}

async function criarAssento() {
  error.value = ''

  if (!salaId.value || !numero.value || !fila.value) {
    error.value = 'Preencha sala, número e fila.'
    return
  }

  try {
    await api.post('/assentos/assentos/', {
      id_sala: Number(salaId.value),
      numero: Number(numero.value),
      fila: fila.value.toUpperCase(),
      status: true,
    })

    salaId.value = ''
    numero.value = ''
    fila.value = ''

    await carregarDados()
  } catch {
    error.value = 'Não foi possível criar o assento.'
  }
}

async function mudarStatus(assento: Assento) {
  try {
    await api.patch(`/assentos/assentos/${assento.id}/`, {
      status: !assento.status,
    })

    await carregarDados()
  } catch {
    alert('Não foi possível mudar o status do assento.')
  }
}

function getSalaNome(id: number) {
  const sala = salas.value.find((item) => item.id === id)

  return sala ? `Sala ${sala.numero}` : `Sala ${id}`
}

onMounted(carregarDados)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Assentos</h1>
      <p class="page-subtitle">Crie assentos e altere disponibilidade.</p>

      <AppCard class="form-card">
        <h2>Criar Assento</h2>

        <form class="form" @submit.prevent="criarAssento">
          <label class="field">
            <span>Sala</span>
            <select v-model="salaId">
              <option value="">Selecione uma sala</option>
              <option
                v-for="sala in salas"
                :key="sala.id"
                :value="sala.id"
              >
                Sala {{ sala.numero }} (Capacidade: {{ sala.capacidade }})
              </option>
            </select>
          </label>

          <AppInput v-model="numero" label="Número do assento" type="number" />
          <AppInput v-model="fila" label="Fila" />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <AppButton type="submit">
            Criar Assento
          </AppButton>
        </form>
      </AppCard>

      <LoadingSpinner v-if="loading" />

      <div v-else class="grid grid-2">
        <AppCard
          v-for="assento in assentosOrdenados"
          :key="assento.id"
        >
          <h2>Fila {{ assento.fila }} - Assento {{ assento.numero }}</h2>
          <p>{{ getSalaNome(assento.id_sala) }}</p>

          <span
            class="status"
            :class="assento.status ? 'available' : 'unavailable'"
          >
            {{ assento.status ? 'Disponível' : 'Indisponível' }}
          </span>

          <div class="actions">
            <AppButton
              :variant="assento.status ? 'danger' : 'primary'"
              @click="mudarStatus(assento)"
            >
              {{ assento.status ? 'Marcar indisponível' : 'Marcar disponível' }}
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
  gap: 6px;
  color: var(--color-muted-light);
}

select {
  background: var(--color-bg-input);
  color: white;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
}

.status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 14px;
  font-size: 13px;
}

.available {
  background: var(--color-success);
  color: white;
}

.unavailable {
  background: var(--color-error-status);
  color: white;
}
</style>
