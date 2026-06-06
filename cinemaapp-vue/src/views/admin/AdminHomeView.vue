<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import AppCard from '@/components/AppCard.vue'

const cards = [
  {
    title: 'Cadastrar Filme',
    text: 'Adicionar novo filme ao catálogo.',
    path: '/admin/cadastrar-filme',
  },
  {
    title: 'Gerenciar Filmes',
    text: 'Listar, editar e excluir filmes.',
    path: '/admin/listar-filmes',
  },
  {
    title: 'Gerenciar Gêneros',
    text: 'Criar, editar e excluir gêneros.',
    path: '/admin/listar-generos',
  },
  {
    title: 'Gerenciar Assentos',
    text: 'Criar assentos e mudar status.',
    path: '/admin/listar-assentos',
  },
  {
    title: 'Cadastrar Sessão',
    text: 'Adicionar novos horários e vincular filmes às salas.',
    path: '/admin/cadastrar-sessao',
  },
  {
    title: 'Cadastrar Cliente',
    text: 'Criar usuário do tipo cliente.',
    path: '/admin/cadastrar-usuario?tipo=cliente',
  },
  {
    title: 'Cadastrar Administrador',
    text: 'Criar usuário administrador.',
    path: '/admin/cadastrar-usuario?tipo=administrador',
  },
]
</script>

<template>
  <AppLayout>
    <section class="page">
      <h1 class="page-title">Área Administrativa</h1>
      <p class="page-subtitle">Escolha uma ação para gerenciar o CinemaApp.</p>

      <div class="grid grid-2">
        <RouterLink
          v-for="card in cards"
          :key="card.path"
          :to="card.path"
        >
          <AppCard class="action-card">
            <h2>{{ card.title }}</h2>
            <p>{{ card.text }}</p>
          </AppCard>
        </RouterLink>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.action-card {
  height: 100%;
  transition: 0.2s;
}

.action-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

h2 {
  color: var(--color-primary-light);
  margin-top: 0;
}

p {
  color: var(--color-muted-light);
}
</style>