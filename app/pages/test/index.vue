<script setup lang="ts">
/// Starts a new test of 30 random questions and jumps to its first question.
definePageMeta({ layout: 'test' })
const { t } = useI18n()
const { post } = useUserPost()

const { attemptId } = await post<{ attemptId: string }>({ url: '/api/start-test' })
await navigateTo(`/test/${attemptId}/1`, { replace: true })
</script>

<template>
  <p>{{ t('test.loading') }}</p>
</template>
