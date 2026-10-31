<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('landing.title') })
</script>

<template>
  <section class="grid items-center gap-8 lg:min-h-[calc(100vh-10rem)] lg:grid-cols-2 lg:gap-12">
    <div class="flex flex-col items-start gap-6">
      <h1 class="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
        {{ t('landing.title') }}
      </h1>
      <p class="text-lg font-bold">
        {{ t('landing.free') }}
      </p>
      <NbButton
        to="/test"
        class="text-lg"
      >
        {{ t('landing.cta') }}
      </NbButton>
      <div class="flex flex-col gap-1 text-base opacity-75">
        <p>{{ t('landing.why') }}</p>
        <p>{{ t('landing.note') }}</p>
      </div>
    </div>
    <img
      src="/hero-car.png"
      alt=""
      width="811"
      height="367"
      class="w-full object-contain [image-rendering:pixelated]"
    >
  </section>
</template>
