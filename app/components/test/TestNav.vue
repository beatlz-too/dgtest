<script setup lang="ts">
/// Previous / next. On the last question, next becomes finish (enabled once all are answered).
/// Once completed, the right button opens the result instead.
/// Root is `contents`: the buttons and the default slot (between them) lay out in the parent.
defineProps<{ isFirst: boolean, isLast: boolean, canFinish: boolean, resultPath?: string }>()
const emit = defineEmits<{ previous: [], next: [], finish: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="contents">
    <NbButton
      variant="light"
      :disabled="isFirst"
      @click="emit('previous')"
    >
      {{ t('test.previous') }}
    </NbButton>
    <slot />
    <NbButton
      v-if="resultPath"
      variant="dark"
      :to="resultPath"
    >
      {{ t('test.result') }}
    </NbButton>
    <NbButton
      v-else-if="isLast"
      variant="dark"
      :disabled="!canFinish"
      @click="emit('finish')"
    >
      {{ t('test.finish') }}
    </NbButton>
    <NbButton
      v-else
      @click="emit('next')"
    >
      {{ t('test.next') }}
    </NbButton>
  </div>
</template>
