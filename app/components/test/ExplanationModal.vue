<script setup lang="ts">
const emit = defineEmits<{ save: [explanation: string], close: [] }>()
const { t } = useI18n()
const text = ref('')
</script>

<template>
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center bg-dark/60 p-4"
    @click.self="emit('close')"
  >
    <NbCard class="flex w-full max-w-xl flex-col gap-4">
      <textarea
        v-model="text"
        autofocus
        rows="10"
        class="w-full border-2 border-dark p-3"
        :placeholder="t('test.explanationPlaceholder')"
      />
      <div class="flex justify-end gap-3">
        <NbButton
          variant="light"
          @click="emit('close')"
        >
          {{ t('test.cancel') }}
        </NbButton>
        <NbButton
          :disabled="!text.trim()"
          @click="emit('save', text.trim())"
        >
          {{ t('test.save') }}
        </NbButton>
      </div>
    </NbCard>
  </div>
</template>
