<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import { api } from '@/services/api'
import type { Genero } from '@/types'

const router = useRouter()

const titulo = ref('')
const generoId = ref('')
const duracao = ref('')
const classificacao = ref('')

const generos = ref<Genero[]>([])
const loading = ref(false)
const error = ref('')
const cartaz = ref('')

async function carregarGeneros() {
  try {
    generos.value = await api.get<Genero[]>('/generos/')
  } catch {
    error.value = 'Não foi possível carregar os gêneros.'
  }
}

async function cadastrarFilme() {
  error.value = ''

  if (!titulo.value || !generoId.value || !duracao.value || !classificacao.value) {
    error.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true

  try {
  await api.post('/filmes/', {
    titulo: titulo.value,
    genero: Number(generoId.value),
    duracao: Number(duracao.value),
    classificacao: classificacao.value,
    cartaz: cartaz.value.trim() || null,
  })

    router.push('/admin/listar-filmes')
  } catch {
    error.value = 'Não foi possível cadastrar o filme.'
  } finally {
    loading.value = false
  }
}

onMounted(carregarGeneros)
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Cadastrar Filme</h1>
      <p class="page-subtitle">Adicione um novo filme ao catálogo.</p>

      <AppCard>
        <form class="form" @submit.prevent="cadastrarFilme">
          <AppInput v-model="titulo" label="Título" />
          <AppInput v-model="duracao" label="Duração em minutos" type="number" />
          <AppInput v-model="classificacao" label="Classificação" />
          <AppInput v-model="cartaz" label="URL do cartaz" />

          <label class="field">
            <span>Gênero</span>
            <select v-model="generoId">
              <option value="">Selecione um gênero</option>
              <option
                v-for="genero in generos"
                :key="genero.id"
                :value="genero.id"
              >
                {{ genero.icone }} {{ genero.nome }}
              </option>
            </select>
            <RouterLink to="/admin/listar-generos" class="helper-link">
            Não encontrou o gênero? Gerenciar gêneros
            </RouterLink>
          </label>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="actions">
            <AppButton type="submit" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Filme' }}
            </AppButton>

            <RouterLink to="/admin/listar-filmes">
              <AppButton variant="secondary">Cancelar</AppButton>
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
.helper-link {
  color: var(--color-primary-light);
  font-size: 14px;
}
</style>