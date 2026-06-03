<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/AppButton.vue'

const auth = useAuthStore()

const destinoPrincipal = computed(() => {
  if (auth.user.tipo === 'administrador') {
    return '/admin'
  }

  if (auth.user.tipo === 'cliente') {
    return '/cliente/listar-filmes'
  }

  return '/login'
})
</script>

<template>
  <main class="page home">
    <div class="hero">
      <span class="logo">🎬</span>
      <h1>CinemaApp</h1>
      <p>
        Compre ingressos, escolha sessões e gerencie o cinema em um só lugar.
      </p>

      <div class="actions">
        <RouterLink :to="destinoPrincipal">
          <AppButton>
            Começar
          </AppButton>
        </RouterLink>

        <RouterLink
          v-if="auth.user.tipo === 'guest'"
          to="/register"
        >
          <AppButton variant="secondary">
            Criar conta
          </AppButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: grid;
  place-items: center;
  text-align: center;
}

.hero {
  max-width: 620px;
}

.logo {
  font-size: 54px;
}

h1 {
  color: var(--color-primary-light);
  font-size: 48px;
  margin: 12px 0;
}

p {
  color: var(--color-muted-light);
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}
</style>