<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  placeholder?: string
  modelValue: string | number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <input
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--color-muted-light);
}

input {
  background: var(--color-bg-input);
  color: var(--color-text);
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  padding: 12px;
  outline: none;
}

input:focus {
  border-color: var(--color-primary);
}
</style>