<script setup lang="ts">
/// Top-right of the test screen (sm and up): answered count, errors so far, and the clock.
import { QUESTIONS_PER_TEST } from '#shared/constants/tests'

defineProps<{ secondsLeft: number, answered: number, errors: number }>()
</script>

<template>
  <div class="fixed top-3 right-4 z-50 sm:right-8 lg:right-12 hidden sm:flex items-stretch gap-2 font-black">
    <div class="flex items-center justify-center border-2 border-dark bg-white px-3 py-1 tabular-nums shadow-nb-sm">
      {{ answered }}/{{ QUESTIONS_PER_TEST }}
    </div>
    <TestErrors :errors="errors" />
    <TestTimer :seconds-left="secondsLeft" />
  </div>
</template>
