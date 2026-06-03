<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg);
}

.content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 800px) {
  .layout {
    flex-direction: column;
  }

  .content {
    width: 100%;
  }
}
</style>
