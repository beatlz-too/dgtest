/// Keeps a test's clock running only while its page is open: pauses when the user leaves the test
/// or closes the tab, resumes when the page comes back from the back/forward cache.
export function useTestPause({ pause, onReturn }: { pause: () => void, onReturn: () => void }) {
  const onPageShow = (event: PageTransitionEvent) => event.persisted && onReturn()

  onBeforeRouteLeave(() => pause())
  onMounted(() => {
    window.addEventListener('pagehide', pause)
    window.addEventListener('pageshow', onPageShow)
  })
  onUnmounted(() => {
    window.removeEventListener('pagehide', pause)
    window.removeEventListener('pageshow', onPageShow)
  })
}
