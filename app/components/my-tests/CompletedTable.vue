<script setup lang="ts">
import { MAX_MISTAKES_TO_PASS, QUESTIONS_PER_TEST } from '#shared/constants/tests'
import type { AttemptSummary } from '#shared/types/attempts'

const { tests } = defineProps<{ tests: AttemptSummary[] }>()
const { t, d } = useI18n()
const passed = (summary: AttemptSummary) => summary.totalErrors <= MAX_MISTAKES_TO_PASS
</script>

<template>
  <div class="overflow-x-auto border-2 border-dark bg-white shadow-nb">
    <table class="w-full text-left">
      <thead class="bg-dark text-light">
        <tr class="*:px-4 *:py-3 *:font-black">
          <th>{{ t('myTests.result') }}</th>
          <th>{{ t('myTests.date') }}</th>
          <th>{{ t('myTests.scoreHeader') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="summary in tests"
          :key="summary.id"
          class="cursor-pointer border-t-2 border-dark transition-opacity *:px-4 *:py-3 hover:opacity-60"
          tabindex="0"
          @click="navigateTo(`/my-tests/${summary.id}`)"
          @keydown.enter="navigateTo(`/my-tests/${summary.id}`)"
        >
          <td
            class="font-black"
            :class="passed(summary) ? 'text-success' : 'text-danger'"
          >
            {{ passed(summary) ? t('review.passed') : t('review.failed') }}
          </td>
          <td class="whitespace-nowrap">
            {{ d(new Date(summary.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) }}
          </td>
          <td class="font-bold">
            {{ t('myTests.score', { correct: QUESTIONS_PER_TEST - summary.totalErrors, total: QUESTIONS_PER_TEST }) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
