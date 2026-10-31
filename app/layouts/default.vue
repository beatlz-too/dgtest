<script setup lang="ts">
const { t } = useI18n()
const { ensureUserId } = useUserId()
onMounted(() => ensureUserId())
</script>

<template>
  <div class="min-h-screen">
    <header class="flex items-center justify-between gap-3 border-b-2 border-dark bg-white px-4 py-3 sm:px-8 lg:px-12">
      <AppBrand />
      <nav class="flex items-center gap-3 px-4">
        <NuxtLink
          to="/my-tests"
          class="w-32 text-center font-bold underline underline-offset-4"
        >
          {{ t('nav.myTests') }}
        </NuxtLink>
        <LocaleSwitch />
      </nav>
    </header>
    <main class="w-full px-4 py-8 sm:px-8 lg:px-12">
      <slot />
    </main>
  </div>
</template>
