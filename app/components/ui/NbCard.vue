<script setup lang="ts">
/// Neo-Brutalism UI card: thick border, hard shadow.
const { variant = 'light' } = defineProps<{ variant?: 'light' | 'primary' | 'success' | 'danger' }>()

const VARIANTS = {
  light: 'bg-white',
  primary: 'bg-primary',
  success: 'bg-success',
  danger: 'bg-danger text-light',
} as const
</script>

<template>
  <div
    class="border-2 border-dark p-4 shadow-nb"
    :class="VARIANTS[variant]"
  >
    <slot />
  </div>
</template>
