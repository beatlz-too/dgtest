/// Counts down from `secondsLeft`. `restart` sets a new starting point, e.g. after the page comes back.
export function useCountdown({ secondsLeft: initial }: { secondsLeft: number }) {
  let endsAt = Date.now() + initial * 1000
  const remaining = () => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
  const secondsLeft = ref(remaining())
  const timer = setInterval(() => (secondsLeft.value = remaining()), 1000)
  onUnmounted(() => clearInterval(timer))

  function restart({ secondsLeft: from }: { secondsLeft: number }): void {
    endsAt = Date.now() + from * 1000
    secondsLeft.value = remaining()
  }

  return { secondsLeft, restart }
}
