<script setup lang="ts">
import type { AttemptQuestion } from '#shared/types/attempts'
import type { AnswerLetter } from '#shared/types/tests'

const { question, position } = defineProps<{ question: AttemptQuestion, position: number }>()
const chosen = computed(() => question.answer)
const { t } = useI18n()

function answerClass(letter: AnswerLetter): string {
  if (letter === question.correctAnswer) return 'bg-success'
  if (letter === chosen.value) return 'bg-danger text-light'
  return 'bg-white'
}
</script>

<template>
  <NbCard class="flex flex-col gap-3">
    <p class="font-bold">
      {{ position }}. {{ question.text }}
    </p>
    <ul class="flex flex-col gap-2">
      <li
        v-for="answer in question.answers"
        :key="answer.letter"
        class="flex gap-3 border-2 border-dark p-2"
        :class="answerClass(answer.letter)"
      >
        <span class="font-black">{{ answer.letter }}</span>
        <span class="flex-1">{{ answer.text }}</span>
        <span
          v-if="answer.letter === chosen"
          class="text-sm font-bold"
        >← {{ t('review.yourAnswer') }}</span>
      </li>
    </ul>
    <p
      v-if="!chosen"
      class="text-sm font-bold text-danger"
    >
      {{ t('review.blank') }}
    </p>
  </NbCard>
</template>
