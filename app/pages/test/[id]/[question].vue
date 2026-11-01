<script setup lang="ts">
import { QUESTIONS_PER_TEST } from '#shared/constants/tests'

definePageMeta({ layout: 'test' })
const { t } = useI18n()
const route = useRoute()
const attemptId = String(route.params.id)
const position = computed(() => Number(route.params.question))

const { view, error, choosing, choose, undo, resume, pause, finish } = await useTestAttempt({ attemptId })
const question = computed(() => view.value?.questions[position.value - 1])
const reviewPath = `/my-tests/${attemptId}`

const { secondsLeft, restart } = useCountdown({ secondsLeft: await resume() })
useTestPause({ pause, onReturn: async () => restart({ secondsLeft: await resume() }) })
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
  <div class="pb-20 sm:pb-0">
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
        :can-undo="!view.isCompleted"
        @choose="letter => choose({ position, letter })"
        @undo="undo({ position })"
      />
      <p
        v-if="finishFailed"
        class="border-2 border-dark bg-danger p-3 font-bold text-light"
      >
        {{ t('test.finishFailed') }}
      </p>
      <div class="hidden justify-between gap-3 sm:flex">
        <TestNav
          :is-first="position === 1"
          :is-last="position === QUESTIONS_PER_TEST"
          :result-path="view.isCompleted ? reviewPath : undefined"
          @previous="goTo(position - 1)"
          @next="goTo(position + 1)"
        />
      </div>
      <footer class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-2 border-t-2 border-dark bg-white p-2 text-sm font-black *:px-1! sm:hidden">
        <TestNav
          :is-first="position === 1"
          :is-last="position === QUESTIONS_PER_TEST"
          :result-path="view.isCompleted ? reviewPath : undefined"
          @previous="goTo(position - 1)"
          @next="goTo(position + 1)"
        >
          <TestErrors :errors="view.totalErrors" />
          <TestTimer
            :seconds-left="secondsLeft"
            class="text-base!"
          />
        </TestNav>
      </footer>
    </div>
  </div>
</template>
