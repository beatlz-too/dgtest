<script setup lang="ts">
import { TEST_WARNING_SECONDS } from '#shared/constants/tests'

const { secondsLeft } = defineProps<{ secondsLeft: number }>()
const { t } = useI18n()

const label = computed(() => {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})
</script>

<template>
  <div
    role="timer"
    :aria-label="t('test.timer')"
    class="flex items-center justify-center text-center border-2 border-dark px-3 py-1 font-mono text-xl font-black tabular-nums shadow-nb-sm"
    :class="secondsLeft <= TEST_WARNING_SECONDS ? 'bg-danger text-light' : 'bg-white text-dark'"
  >
    {{ label }}
  </div>
</template>
