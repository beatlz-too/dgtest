<script setup lang="ts">
import { QUESTIONS_PER_TEST } from '#shared/constants/tests'
import type { StartedAttemptSummary } from '#shared/types/attempts'

const { summary } = defineProps<{ summary: StartedAttemptSummary }>()
const { t, d } = useI18n()
</script>

<template>
  <NbCard class="flex flex-col gap-4">
    <p class="text-xl font-black">
      {{ d(new Date(summary.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) }}<br>
      {{ summary.totalAnswered }}/{{ QUESTIONS_PER_TEST }} · {{ t('test.errors', { count: summary.totalErrors }) }}
    </p>
    <NbButton
      :to="`/test/${summary.id}/${summary.nextPosition}`"
      class="mt-auto self-start"
    >
      {{ t('myTests.continue') }}
    </NbButton>
  </NbCard>
</template>
