<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="app-button"
    :class="variant || 'primary'"
    :type="type || 'button'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.app-button:hover {
  opacity: 0.85;
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background: var(--color-primary);
}

.secondary {
  background: var(--color-button-secondary);
}

.danger {
  background: var(--color-danger);
}
</style>