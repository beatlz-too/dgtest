<script setup lang="ts">
/// Previous / next. Once every question is answered, the right button opens the result instead.
/// Root is `contents`: the buttons and the default slot (between them) lay out in the parent.
defineProps<{ isFirst: boolean, isLast: boolean, resultPath?: string }>()
const emit = defineEmits<{ previous: [], next: [] }>()
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
      v-else
      :disabled="isLast"
      @click="emit('next')"
    >
      {{ t('test.next') }}
    </NbButton>
  </div>
</template>
