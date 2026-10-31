<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
</script>

<template>
  <select
    :value="locale"
    :aria-label="t('nav.language')"
    class="w-32 border-2 border-dark bg-white px-2 py-1 text-center font-bold shadow-nb-sm"
    @change="setLocale(($event.target as HTMLSelectElement).value as typeof locale)"
  >
    <option
      v-for="option in locales"
      :key="option.code"
      :value="option.code"
    >
      {{ option.code.toUpperCase() }}
    </option>
  </select>
</template>
