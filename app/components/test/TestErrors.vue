<script setup lang="ts">
/// Errors so far: warns at the pass limit, turns red past it.
import { MAX_MISTAKES_TO_PASS } from '#shared/constants/tests'

defineProps<{ errors: number }>()
const { t } = useI18n()
</script>

<template>
  <div
    class="flex items-center justify-center text-center border-2 border-dark px-3 py-1 tabular-nums shadow-nb-sm"
    :class="errors > MAX_MISTAKES_TO_PASS ? 'bg-danger text-light' : errors === MAX_MISTAKES_TO_PASS ? 'bg-warning' : 'bg-white'"
  >
    {{ t('test.errors', { count: errors }) }}
  </div>
</template>
