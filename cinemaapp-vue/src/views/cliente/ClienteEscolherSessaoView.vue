<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Sessao } from '@/types'

const route = useRoute()

const filmeId = Number(route.query.filmeId)
const filmeTitulo = String(route.query.filmeTitulo || 'Filme')

const parametrosInvalidos = computed(() => {
  return !filmeId || !filmeTitulo
})

const sessoes = ref<Sessao[]>([])
const loading = ref(false)
const error = ref('')

const sessoesDoFilme = computed(() => {
  return sessoes.value.filter((sessao) => {
    return sessao.filme === filmeId && sessao.ativa
  })
})

function formatarHorario(horario: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(horario))
}

async function carregarSessoes() {
  loading.value = true
  error.value = ''

  try {
    sessoes.value = await api.get<Sessao[]>('/sessoes/')
  } catch {
    error.value = 'Não foi possível carregar as sessões.'
  } finally {
    loading.value = false
  }
}

onMounted(carregarSessoes)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Escolher Sessão</h1>
      <p class="page-subtitle">{{ filmeTitulo }}</p>

      <div v-if="parametrosInvalidos" class="error-message">
        Filme inválido. Volte e escolha um filme novamente.
      </div>

     <LoadingSpinner v-else-if="loading" />

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="sessoesDoFilme.length === 0" class="empty">
        Nenhuma sessão ativa encontrada para este filme.
      </div>

      <div v-else class="grid">
        <AppCard
          v-for="sessao in sessoesDoFilme"
          :key="sessao.id"
        >
          <h2>{{ formatarHorario(sessao.horario) }}</h2>
          <p>Sala: {{ sessao.sala }}</p>

          <RouterLink
            :to="{
              path: '/cliente/comprar-ingresso',
              query: {
                sessaoId: sessao.id,
                filmeTitulo,
              },
            }"
          >
            <AppButton>Comprar Ingresso</AppButton>
          </RouterLink>
        </AppCard>
      </div>

      <RouterLink to="/cliente/listar-filmes" class="back">
        Voltar para filmes
      </RouterLink>
    </section>
  </AppLayout>
</template>

<style scoped>
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

.back {
  display: inline-block;
  margin-top: 20px;
  color: var(--color-primary-light);
}
</style>