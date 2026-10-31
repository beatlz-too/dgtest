<script setup lang="ts">
import { MAX_MISTAKES_TO_PASS, QUESTIONS_PER_TEST } from '#shared/constants/tests'
import type { AttemptSummary } from '#shared/types/attempts'

const { summary } = defineProps<{ summary: AttemptSummary }>()
const { t, d } = useI18n()
const passed = computed(() => summary.totalErrors <= MAX_MISTAKES_TO_PASS)
</script>

<template>
  <NbCard class="flex flex-col gap-4">
    <p class="text-xl font-black">
      <span :class="passed ? 'text-success' : 'text-danger'">
        {{ passed ? t('review.passed') : t('review.failed') }}
      </span><br>
      {{ d(new Date(summary.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) }}<br>
      {{ t('myTests.score', { correct: QUESTIONS_PER_TEST - summary.totalErrors, total: QUESTIONS_PER_TEST }) }}
    </p>
    <NbButton
      variant="dark"
      :to="`/my-tests/${summary.id}`"
      class="mt-auto self-start"
    >
      {{ t('myTests.review') }}
    </NbButton>
  </NbCard>
</template>
