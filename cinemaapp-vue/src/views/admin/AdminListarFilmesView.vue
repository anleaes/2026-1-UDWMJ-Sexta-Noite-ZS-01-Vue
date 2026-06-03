<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Filme } from '@/types'

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

async function excluirFilme(id: number) {
  const confirmar = confirm('Deseja realmente excluir este filme?')

  if (!confirmar) {
    return
  }

  try {
    await api.delete(`/filmes/${id}/`)
    await carregarFilmes()
  } catch {
    alert('Não foi possível excluir o filme.')
  }
}

onMounted(carregarFilmes)
</script>

<template>
  <AppLayout>
    <section class="page">
      <div class="top">
        <div>
          <h1 class="page-title">Gerenciar Filmes</h1>
          <p class="page-subtitle">Liste, edite e exclua filmes cadastrados.</p>
        </div>

        <RouterLink to="/admin/cadastrar-filme">
          <AppButton>Cadastrar Filme</AppButton>
        </RouterLink>
      </div>

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

        <div v-else class="grid">
        <AppCard
            v-for="filme in filmesFiltrados"
            :key="filme.id"
        >
            <h2>{{ filme.titulo }}</h2>
            <p>Classificação: {{ filme.classificacao }}</p>
            <p>Duração: {{ filme.duracao }} min</p>
            <p>Gênero ID: {{ filme.genero }}</p>

            <div class="actions">
            <RouterLink
                :to="{
                path: '/admin/editar-filme',
                query: {
                    id: filme.id,
                    titulo: filme.titulo,
                    duracao: filme.duracao,
                    classificacao: filme.classificacao,
                    genero: filme.genero,
                },
                }"
            >
                <AppButton variant="secondary">Editar</AppButton>
            </RouterLink>

            <AppButton
                variant="danger"
                @click="excluirFilme(filme.id)"
            >
                Excluir
            </AppButton>
            </div>
        </AppCard>
        </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

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
</style>