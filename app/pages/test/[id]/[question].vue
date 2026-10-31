<script setup lang="ts">
import { QUESTIONS_PER_TEST, TEST_DURATION_SECONDS } from '#shared/constants/tests'

definePageMeta({ layout: 'test' })
const { t } = useI18n()
const route = useRoute()
const attemptId = String(route.params.id)
const position = computed(() => Number(route.params.question))

const { view, error, choosing, choose, finish } = await useTestAttempt({ attemptId })
const question = computed(() => view.value?.questions[position.value - 1])
const reviewPath = `/my-tests/${attemptId}`

const startedAt = view.value ? Date.parse(view.value.startedAt) : Date.now()
const { secondsLeft } = useCountdown({ startedAt, durationSeconds: TEST_DURATION_SECONDS })
const finishFailed = ref(false)

const goTo = (to: number) => navigateTo(`/test/${attemptId}/${to}`)

async function timeUp() {
  if (!view.value || view.value.isCompleted) return
  finishFailed.value = false
  try {
    await finish()
    await navigateTo(reviewPath, { replace: true })
  }
  catch {
    finishFailed.value = true
  }
}

if (view.value?.isCompleted) await navigateTo(reviewPath, { replace: true })
watch(secondsLeft, left => left === 0 && timeUp(), { immediate: true })
</script>

<template>
  <div>
    <TestStatus
      :seconds-left="secondsLeft"
      :answered="view?.totalAnswered ?? 0"
      :errors="view?.totalErrors ?? 0"
    />
    <p v-if="error">
      {{ t('test.notFound') }}
    </p>
    <div
      v-else-if="view && question"
      class="mx-auto flex flex-col gap-6"
      :class="{ 'max-w-2xl': !question.image }"
    >
      <p class="font-bold">
        {{ t('test.question', { current: position, total: QUESTIONS_PER_TEST }) }}
      </p>
      <TestQuestion
        :question="question"
        :disabled="choosing"
        @choose="letter => choose({ position, letter })"
      />
      <p
        v-if="finishFailed"
        class="border-2 border-dark bg-danger p-3 font-bold text-light"
      >
        {{ t('test.finishFailed') }}
      </p>
      <TestNav
        :is-first="position === 1"
        :is-last="position === QUESTIONS_PER_TEST"
        :result-path="view.isCompleted ? reviewPath : undefined"
        @previous="goTo(position - 1)"
        @next="goTo(position + 1)"
      />
    </div>
  </div>
</template>
