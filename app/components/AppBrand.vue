<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    to="/"
    class="font-pixel text-3xl text-warning [text-shadow:2px_2px_0_var(--color-primary)]"
  >
    {{ t('nav.brand') }}
  </NuxtLink>
</template>
