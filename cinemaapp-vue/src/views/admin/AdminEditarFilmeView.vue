<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import { api } from '@/services/api'
import type { Genero } from '@/types'

const route = useRoute()
const router = useRouter()

const id = String(route.query.id || '')
const titulo = ref(String(route.query.titulo || ''))
const duracao = ref(String(route.query.duracao || ''))
const classificacao = ref(String(route.query.classificacao || ''))
const generoId = ref(String(route.query.genero || ''))

const generos = ref<Genero[]>([])
const loading = ref(false)
const error = ref('')
const cartaz = ref(String(route.query.cartaz || ''))

async function carregarGeneros() {
  try {
    generos.value = await api.get<Genero[]>('/generos/')
  } catch {
    error.value = 'Não foi possível carregar os gêneros.'
  }
}

async function salvar() {
  error.value = ''

  if (!id) {
    error.value = 'Filme inválido.'
    return
  }
  if (!titulo.value || !duracao.value || !classificacao.value) {
    error.value = 'Preencha título, duração e classificação.'
    return
  }
  loading.value = true

  try {
    await api.patch(`/filmes/${id}/`, {
      titulo: titulo.value,
      duracao: Number(duracao.value),
      classificacao: classificacao.value,
      genero: generoId.value ? Number(generoId.value) : null,
      cartaz: cartaz.value.trim() || null,
    })

    router.push('/admin/listar-filmes')
  } catch {
    error.value = 'Não foi possível atualizar o filme.'
  } finally {
    loading.value = false
  }
}

onMounted(carregarGeneros)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Editar Filme</h1>
      <p class="page-subtitle">Atualize as informações do filme.</p>

      <AppCard>
        <form class="form" @submit.prevent="salvar">
          <AppInput v-model="titulo" label="Título" />
          <AppInput v-model="duracao" label="Duração em minutos" type="number" />
          <AppInput v-model="classificacao" label="Classificação" />
          <AppInput v-model="cartaz" label="URL do cartaz" />

          <label class="field">
            <span>Gênero</span>
            <select v-model="generoId">
              <option value="">Sem gênero</option>
              <option
                v-for="genero in generos"
                :key="genero.id"
                :value="genero.id"
              >
                {{ genero.icone }} {{ genero.nome }}
              </option>
            </select>
          </label>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="actions">
            <AppButton type="submit" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
            </AppButton>

            <RouterLink to="/admin/listar-filmes">
              <AppButton variant="secondary">Voltar</AppButton>
            </RouterLink>
          </div>
        </form>
      </AppCard>
    </section>
  </AppLayout>
</template>

<style scoped>
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
</style>