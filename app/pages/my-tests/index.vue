<script setup lang="ts">
import type { AttemptSummary, StartedAttemptSummary } from '#shared/types/attempts'

const { t } = useI18n()
useHead({ title: () => t('myTests.title') })
const { data: tests, pending } = useUserFetch<AttemptSummary[]>({ url: '/api/my-tests' })
const { data: started } = useUserFetch<StartedAttemptSummary[]>({ url: '/api/started-tests' })
</script>

<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-3xl font-black">
      {{ t('myTests.title') }}
    </h1>
    <p v-if="pending">
      {{ t('myTests.loading') }}
    </p>
    <template v-if="started?.length">
      <h2 class="text-2xl font-black">
        {{ t('myTests.started') }}
      </h2>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MyTestsStartedTestCard
          v-for="summary in started"
          :key="summary.id"
          :summary="summary"
        />
      </div>
      <h2 class="text-2xl font-black">
        {{ t('myTests.completed') }}
      </h2>
    </template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <MyTestsNewTestCard />
      <MyTestsTestCard
        v-for="summary in tests ?? []"
        :key="summary.id"
        :summary="summary"
      />
    </div>
  </section>
</template>
