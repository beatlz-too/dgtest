<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <NbButton
    to="/test"
    class="fixed right-4 bottom-4 z-50 text-lg font-black shadow-nb! sm:right-8 sm:bottom-8 lg:right-12"
  >
    + {{ t('myTests.newTest') }}
  </NbButton>
</template>
