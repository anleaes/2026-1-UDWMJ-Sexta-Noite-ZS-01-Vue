<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Filme } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const filmes = ref<Filme[]>([])
const busca = ref('')
const loading = ref(false)
const error = ref('')

const filmesFiltrados = computed(() => {
  const termo = busca.value.toLowerCase().trim()

  if (!termo) {
    return filmes.value
  }

  return filmes.value.filter((filme) => {
    return (
      filme.titulo.toLowerCase().includes(termo) ||
      filme.classificacao.toLowerCase().includes(termo)
    )
  })
})

async function carregarFilmes() {
  loading.value = true
  error.value = ''

  try {
    filmes.value = await api.get<Filme[]>('/filmes/')
  } catch {
    error.value = 'Não foi possível carregar os filmes.'
  } finally {
    loading.value = false
  }
}

function getCartazUrl(cartaz?: string | null) {
  if (!cartaz) {
    return ''
  }

  if (cartaz.startsWith('http')) {
    return cartaz
  }

  return `${API_URL}${cartaz}`
}

onMounted(carregarFilmes)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Filmes em Cartaz</h1>
      <p class="page-subtitle">Escolha um filme para comprar ingresso.</p>

      <input
        v-model="busca"
        class="search"
        placeholder="Buscar por título ou classificação"
      />

      <LoadingSpinner v-if="loading" />

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="filmesFiltrados.length === 0" class="empty">
        Nenhum filme encontrado.
      </div>

      <div v-else class="grid grid-2">
        <AppCard
          v-for="filme in filmesFiltrados"
          :key="filme.id"
        >
          <img
            v-if="filme.cartaz"
            :src="getCartazUrl(filme.cartaz)"
            :alt="`Cartaz de ${filme.titulo}`"
            class="poster"
          />

          <h2>{{ filme.titulo }}</h2>
          <p>Classificação: {{ filme.classificacao }}</p>
          <p>Duração: {{ filme.duracao }} min</p>

          <RouterLink
            :to="{
              path: '/cliente/escolher-sessao',
              query: {
                filmeId: filme.id,
                filmeTitulo: filme.titulo,
              },
            }"
          >
            <AppButton>Escolher Sessão</AppButton>
          </RouterLink>
        </AppCard>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.search {
  width: 100%;
  margin-bottom: 20px;
  background: var(--color-bg-input);
  color: white;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
}

h2 {
  color: var(--color-primary-light);
  margin-top: 0;
}

p {
  color: var(--color-muted-light);
}

.empty {
  color: var(--color-muted-light);
  border: 1px dashed var(--color-border-soft);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.poster {
  width: min(100%, 220px);
  aspect-ratio: 2 / 3;
  object-fit: contain;
  background: var(--color-bg-input);
  display: block;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid var(--color-border-soft);
}
</style>
