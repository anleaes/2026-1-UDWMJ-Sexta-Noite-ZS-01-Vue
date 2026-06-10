<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import { api } from '@/services/api'
import type { Genero } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

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
const cartazAtual = ref(String(route.query.cartaz || ''))
const cartaz = ref<File | null>(null)

function selecionarCartaz(event: Event) {
  const input = event.target as HTMLInputElement
  cartaz.value = input.files?.[0] || null
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
    const formData = new FormData()
    formData.append('titulo', titulo.value)
    formData.append('duracao', String(Number(duracao.value)))
    formData.append('classificacao', classificacao.value)

    if (generoId.value) {
      formData.append('genero', String(Number(generoId.value)))
    }

    if (cartaz.value) {
      formData.append('cartaz', cartaz.value)
    }

    await api.patchForm(`/filmes/${id}/`, formData)

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
          <label class="field">
            <span>Cartaz</span>
            <img
              v-if="cartazAtual"
              :src="getCartazUrl(cartazAtual)"
              alt="Cartaz atual"
              class="poster-preview"
            />
            <input type="file" accept="image/*" @change="selecionarCartaz" />
          </label>

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

input[type='file'] {
  background: var(--color-bg-input);
  color: white;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
}

.poster-preview {
  width: 140px;
  aspect-ratio: 2 / 3;
  object-fit: contain;
  background: var(--color-bg-input);
  border-radius: 8px;
  border: 1px solid var(--color-border-soft);
}
</style>
