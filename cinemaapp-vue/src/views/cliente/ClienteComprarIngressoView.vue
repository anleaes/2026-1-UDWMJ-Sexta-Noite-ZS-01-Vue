Aqui está o seu arquivo **`ClienteComprarIngresso.vue`** completo e atualizado com todas as alterações integradas!

Eu arrumei a função de carregar os dados (para ele puxar a lista de ocupados da API), arrumei as variáveis do HTML que estavam dando conflito, e adicionei o CSS da linha diagonal.

Pode copiar tudo e colar por cima do seu arquivo inteiro:

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Assento, Pedido } from '@/types'

const route = useRoute()
const router = useRouter()

const sessaoId = Number(route.query.sessaoId)
const filmeTitulo = String(route.query.filmeTitulo || 'Filme')

const assentos = ref<Assento[]>([])
const assentosOcupadosIds = ref<number[]>([]) 
const assentosSelecionados = ref<number[]>([])
const tipoIngresso = ref('Inteira')

const loading = ref(false)
const comprando = ref(false)
const error = ref('')

const tiposIngresso = [
  'Inteira',
  'Meia (estudante)',
  'Idoso',
  'Cortesia',
]

const assentosOrdenados = computed(() => {
  return [...assentos.value].sort((a, b) => {
    if (a.fila === b.fila) {
      return a.numero - b.numero
    }
    return a.fila.localeCompare(b.fila)
  })
})

function isIndisponivel(assento: Assento) {
  return assento.status === false || assentosOcupadosIds.value.includes(assento.id)
}

function toggleAssento(id: number) {
  if (assentosSelecionados.value.includes(id)) {
    assentosSelecionados.value = assentosSelecionados.value.filter((item) => item !== id)
  } else {
    assentosSelecionados.value.push(id)
  }
}

async function carregarAssentos() {
  loading.value = true
  error.value = ''

  try {
    const [assentosRes, ingressosRes] = await Promise.all([
      api.get<Assento[]>('/assentos/assentos/'),
      api.get<{ assento: number }[]>(`/ingresso/api/?sessao=${sessaoId}`)    ])

    assentos.value = assentosRes
    
    assentosOcupadosIds.value = ingressosRes.map(ingresso => ingresso.assento)

  } catch {
    error.value = 'Não foi possível carregar o mapa de assentos.'
  } finally {
    loading.value = false
  }
}

async function comprar() {
  error.value = ''

  if (assentosSelecionados.value.length === 0) {
    error.value = 'Selecione pelo menos um assento.'
    return
  }

  comprando.value = true

  try {
    const pedido = await api.post<Pedido>('/pedido/api/', {
      status: 'criado',
    })

    for (const assentoId of assentosSelecionados.value) {
      await api.post('/ingresso/api/', {
        pedido: pedido.id,
        sessao: sessaoId,
        assento: assentoId,
        codigoQR: `QR-${pedido.id}-${assentoId}-${Date.now()}`,
        ingressoMeiaEntrada: tipoIngresso.value !== 'Inteira',
      })
    }

    router.push({
      path: '/cliente/compra-confirmacao',
      query: {
        pedidoId: pedido.id,
        filmeTitulo,
        assentos: assentosSelecionados.value.join(','),
      },
    })
  } catch {
    error.value = 'Não foi possível finalizar a compra.'
  } finally {
    comprando.value = false
  }
}

onMounted(carregarAssentos)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Comprar Ingresso</h1>
      <p class="page-subtitle">{{ filmeTitulo }}</p>

      <LoadingSpinner v-if="loading" />

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="!loading">
        <AppCard class="ticket-card">
          <label class="field">
            <span>Tipo de ingresso</span>
            <select v-model="tipoIngresso">
              <option
                v-for="tipo in tiposIngresso"
                :key="tipo"
                :value="tipo"
              >
                {{ tipo }}
              </option>
            </select>
          </label>

          <h2>Mapa de Assentos</h2>

          <div
            v-if="assentosOrdenados.length === 0"
            class="empty"
          >
            Nenhum mapa de assentos disponível para esta sala.
          </div>

          <div v-else class="seat-grid">
            <button
              v-for="assento in assentosOrdenados"
              :key="assento.id"
              class="seat"
              :class="{ 
                selected: assentosSelecionados.includes(assento.id),
                ocupado: isIndisponivel(assento)
              }"
              :disabled="isIndisponivel(assento)"
              @click="toggleAssento(assento.id)"
            >
              {{ assento.fila }}{{ assento.numero }}
            </button>
          </div>

          <p class="selected-info">
            Selecionados: {{ assentosSelecionados.length }}
          </p>

          <AppButton
            :disabled="comprando"
            @click="comprar"
          >
            {{ comprando ? 'Finalizando...' : 'Continuar' }}
          </AppButton>
        </AppCard>
      </div>

      <RouterLink to="/cliente/listar-filmes" class="back">
        Voltar para filmes
      </RouterLink>
    </section>
  </AppLayout>
</template>

<style scoped>
.ticket-card {
  max-width: 720px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--color-muted-light);
  margin-bottom: 20px;
}

select {
  background: var(--color-bg-input);
  color: white;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
}

h2 {
  color: var(--color-primary-light);
  margin-bottom: 16px;
}

.seat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.seat {
  min-width: 54px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border-soft);
  background: var(--color-button-secondary);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.seat:hover:not(:disabled) {
  border-color: var(--color-primary-light);
}

.seat.selected {
  background: var(--color-primary);
  border-color: var(--color-primary-light);
}

/* A mágica visual do assento inativo/comprado */
.seat.ocupado {
  cursor: not-allowed;
  opacity: 0.6;
  color: var(--color-muted-light);
  border-color: var(--color-border-soft);
  background: linear-gradient(
    to top right, 
    transparent 46%, 
    var(--color-error-status, #ff4c4c) 48%, 
    var(--color-error-status, #ff4c4c) 52%, 
    transparent 54%
  ), var(--color-bg-input, #2a2a2a);
}

.selected-info {
  color: var(--color-muted-light);
  margin: 18px 0;
}

.empty {
  color: var(--color-muted-light);
  border: 1px dashed var(--color-border-soft);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.back {
  display: inline-block;
  margin-top: 20px;
  color: var(--color-primary-light);
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}
</style>

```