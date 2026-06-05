<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { api } from '@/services/api'
import type { Filme, Sala } from '@/types'

const router = useRouter()

const filmes = ref<Filme[]>([])
const salas = ref<Sala[]>([])

const filmeId = ref('')
const salaId = ref('')
const horario = ref('')
const ativa = ref(true)

const loading = ref(false)
const saving = ref(false)
const error = ref('')
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Cadastrar Sessão</h1>
      <p class="page-subtitle">Adicione uma nova sessão ao cinema.</p>
    </section>
  </AppLayout>
</template>