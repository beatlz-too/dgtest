<script setup lang="ts">
/// Test pages: the top right belongs to the timer, so the header carries only the brand.
const { ensureUserId } = useUserId()
onMounted(() => ensureUserId())
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b-2 border-dark bg-white px-4 py-3 sm:px-8 lg:px-12">
      <AppBrand />
    </header>
    <main class="w-full px-4 py-6 sm:px-8 lg:px-12">
      <slot />
    </main>
  </div>
</template>
