<script setup lang="ts">
/// A question's explanation, collapsed behind a toggle; or, when it has none, a way to add one.
const { explanation, open } = defineProps<{ explanation?: string, open: boolean }>()
const emit = defineEmits<{ toggle: [], save: [explanation: string] }>()
const { t } = useI18n()
const writing = ref(false)

function save(text: string) {
  writing.value = false
  emit('save', text)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-if="explanation">
      <NbButton
        variant="light"
        class="self-start"
        :aria-expanded="open"
        @click="emit('toggle')"
      >
        {{ open ? t('review.collapseExplanation') : t('review.expandExplanation') }}
      </NbButton>
      <p
        v-if="open"
        class="whitespace-pre-line italic"
      >
        {{ explanation }}
      </p>
    </template>
    <NbButton
      v-else
      class="self-start"
      @click="writing = true"
    >
      {{ t('test.addExplanation') }}
    </NbButton>
    <TestExplanationModal
      v-if="writing"
      @save="save"
      @close="writing = false"
    />
  </div>
</template>
