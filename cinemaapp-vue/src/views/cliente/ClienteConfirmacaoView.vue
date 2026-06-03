<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

const route = useRoute()

const pedidoId = String(route.query.pedidoId || '')
const filmeTitulo = String(route.query.filmeTitulo || 'Filme')
const assentosTexto = String(route.query.assentos || '')

const assentos = computed(() => {
  if (!assentosTexto) {
    return []
  }

  return assentosTexto.split(',').filter(Boolean)
})
</script>

<template>
  <AppLayout>
    <section class="page confirmation-page">
      <AppCard class="confirmation-card">
        <div class="icon">✅</div>

        <h1>Compra confirmada!</h1>

        <p>
          Seu pedido foi criado com sucesso.
        </p>

        <div class="info">
          <strong>Filme:</strong>
          <span>{{ filmeTitulo }}</span>
        </div>

        <div class="info">
          <strong>Número do pedido:</strong>
          <span>{{ pedidoId }}</span>
        </div>

        <div class="badges">
          <span
            v-for="assento in assentos"
            :key="assento"
            class="badge"
          >
            Assento {{ assento }}
          </span>
        </div>

        <div class="actions">
          <RouterLink to="/cliente/listar-filmes">
            <AppButton>Ver outros filmes</AppButton>
          </RouterLink>

          <RouterLink to="/">
            <AppButton variant="secondary">Ir para início</AppButton>
          </RouterLink>
        </div>
      </AppCard>
    </section>
  </AppLayout>
</template>

<style scoped>
.confirmation-page {
  display: grid;
  place-items: center;
}

.confirmation-card {
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.icon {
  font-size: 48px;
}

h1 {
  color: var(--color-primary-light);
}

p {
  color: var(--color-muted-light);
}

.info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.info span {
  color: var(--color-muted-light);
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.badge {
  background: var(--color-primary);
  padding: 8px 12px;
  border-radius: 999px;
  color: white;
  font-size: 14px;
}

.actions {
  justify-content: center;
}
</style>