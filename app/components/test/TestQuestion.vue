<script setup lang="ts">
import type { AttemptQuestion } from '#shared/types/attempts'
import type { AnswerLetter } from '#shared/types/tests'

const { question, disabled = false, canUndo = false } = defineProps<{
  question: AttemptQuestion
  disabled?: boolean
  canUndo?: boolean
}>()
const emit = defineEmits<{ choose: [letter: AnswerLetter], undo: [] }>()
const { t } = useI18n()
const isWrong = computed(() => !!question.answer && question.answer !== question.correctAnswer)

/// Once answered, the question locks: the right answer turns green, and a wrong pick turns red.
function answerClass(letter: AnswerLetter): string {
  if (!question.answer) return 'bg-white hover:bg-primary/40'
  const picked = letter === question.answer ? 'translate-x-0.5 translate-y-0.5 shadow-none' : ''
  if (letter === question.correctAnswer) return `${picked} bg-success`
  return letter === question.answer ? `${picked} bg-danger text-light` : 'bg-white'
}
</script>

<template>
  <div
    class="grid gap-4"
    :class="{ 'lg:grid-cols-2 lg:items-start lg:gap-8': question.image }"
  >
    <img
      v-if="question.image"
      :src="question.image"
      alt=""
      referrerpolicy="no-referrer"
      class="max-h-[50vh] w-full border-2 border-dark bg-white object-contain lg:max-h-[calc(100vh-16rem)]"
    >
    <div class="flex flex-col gap-4">
      <h2 class="text-lg font-bold lg:text-2xl">
        {{ question.text }}
      </h2>
      <ul class="flex flex-col gap-3">
        <li
          v-for="answer in question.answers"
          :key="answer.letter"
        >
          <button
            type="button"
            class="flex w-full items-start gap-3 border-2 border-dark p-3 text-left shadow-nb-sm transition-all"
            :class="answerClass(answer.letter)"
            :disabled="disabled || !!question.answer"
            :aria-pressed="question.answer === answer.letter"
            @click="emit('choose', answer.letter)"
          >
            <span class="font-black">{{ answer.letter }}</span>
            <span>{{ answer.text }}</span>
          </button>
        </li>
      </ul>
      <NbButton
        v-if="canUndo && isWrong"
        variant="light"
        class="self-start"
        :disabled="disabled"
        @click="emit('undo')"
      >
        {{ t('test.undo') }}
      </NbButton>
    </div>
  </div>
</template>
