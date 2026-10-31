export function useCountdown({ startedAt, durationSeconds }: { startedAt: number, durationSeconds: number }) {
  const remaining = () => Math.max(0, durationSeconds - Math.floor((Date.now() - startedAt) / 1000))
  const secondsLeft = ref(remaining())
  const timer = setInterval(() => (secondsLeft.value = remaining()), 1000)
  onUnmounted(() => clearInterval(timer))
  return { secondsLeft }
}
