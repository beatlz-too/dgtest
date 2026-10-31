<script setup lang="ts">
/// Neo-Brutalism UI button (neo-brutalism-ui-library.vercel.app), ported per the `ui` skill.
/// Renders a link when given `to`.
const { variant = 'primary', to } = defineProps<{
  variant?: 'primary' | 'light' | 'dark'
  to?: string
}>()

const VARIANTS = {
  primary: 'bg-primary text-dark',
  light: 'bg-white text-dark',
  dark: 'bg-dark text-light',
} as const

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    class="inline-flex min-h-12 items-center justify-center border-2 border-dark px-4 py-2.5 font-bold shadow-nb-sm transition-all not-disabled:hover:translate-x-0.5 not-disabled:hover:translate-y-0.5 not-disabled:hover:shadow-none disabled:opacity-50"
    :class="VARIANTS[variant]"
  >
    <slot />
  </component>
</template>
