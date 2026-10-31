<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    to="/test"
    class="block"
  >
    <NbCard
      variant="primary"
      class="flex h-full min-h-36 items-center justify-center text-xl font-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      {{ t('myTests.newTest') }}
    </NbCard>
  </NuxtLink>
</template>
