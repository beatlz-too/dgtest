<script setup lang="ts">
/// Top-right of the test screen: answered count, errors so far, and the clock.
import { MAX_MISTAKES_TO_PASS, QUESTIONS_PER_TEST } from '#shared/constants/tests'

defineProps<{ secondsLeft: number, answered: number, errors: number }>()
const { t } = useI18n()
</script>

<template>
  <div class="fixed top-3 right-4 z-50 sm:right-8 lg:right-12 flex items-stretch gap-2 font-black">
    <div class="flex items-center border-2 border-dark bg-white px-3 py-1 tabular-nums shadow-nb-sm">
      {{ answered }}/{{ QUESTIONS_PER_TEST }}
    </div>
    <div
      class="flex items-center border-2 border-dark px-3 py-1 tabular-nums shadow-nb-sm"
      :class="errors > MAX_MISTAKES_TO_PASS ? 'bg-danger text-light' : errors === MAX_MISTAKES_TO_PASS ? 'bg-warning' : 'bg-white'"
    >
      {{ t('test.errors', { count: errors }) }}
    </div>
    <TestTimer :seconds-left="secondsLeft" />
  </div>
</template>
