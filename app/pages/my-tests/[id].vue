<script setup lang="ts">
import { MAX_MISTAKES_TO_PASS, QUESTIONS_PER_TEST } from '#shared/constants/tests'
import type { AttemptQuestion, AttemptView } from '#shared/types/attempts'

const { t, d } = useI18n()
const id = String(useRoute().params.id)
const { data, error } = useUserFetch<AttemptView>({ url: '/api/attempt', query: { id }, deep: true })
const { saveExplanation } = useSaveExplanation()
/// One explanation open at a time.
const openId = ref<number>()
const toggle = (questionId: number) => openId.value = openId.value === questionId ? undefined : questionId

async function explain(question: AttemptQuestion, explanation: string) {
  question.explanation = await saveExplanation({ questionId: question.id, explanation })
  openId.value = question.id
}
const title = computed(() => data.value
  ? t('review.title', { date: d(new Date(data.value.startedAt), { dateStyle: 'medium', timeStyle: 'short' }) })
  : t('myTests.title'))
useHead({ title })
const passed = computed(() => data.value && data.value.totalErrors <= MAX_MISTAKES_TO_PASS)
</script>

<template>
  <section class="flex flex-col gap-6">
    <NbButton
      variant="light"
      to="/my-tests"
      class="self-start"
    >
      ← {{ t('review.back') }}
    </NbButton>
    <h1 class="text-3xl font-black">
      {{ title }}
    </h1>
    <p v-if="error || (data && !data.isCompleted)">
      {{ t('review.notFound') }}
    </p>
    <template v-else-if="data">
      <NbCard
        :variant="passed ? 'success' : 'danger'"
        class="text-xl font-black"
      >
        {{ passed ? t('review.passed') : t('review.failed') }} ·
        {{ t('review.score', { mistakes: data.totalErrors, total: QUESTIONS_PER_TEST }) }}
      </NbCard>
      <ReviewQuestion
        v-for="(question, index) in data.questions"
        :key="question.id"
        :position="index + 1"
        :question="question"
      >
        <ReviewExplanation
          :explanation="question.explanation"
          :open="openId === question.id"
          @toggle="toggle(question.id)"
          @save="text => explain(question, text)"
        />
      </ReviewQuestion>
    </template>
  </section>
</template>
