/// Saves a pasted explanation for a bank question; returns it as stored.
export function useSaveExplanation() {
  const { post } = useUserPost()

  async function saveExplanation({ questionId, explanation }: { questionId: number, explanation: string }): Promise<string> {
    const saved = await post<{ explanation: string }>({ url: '/api/question-explanation', body: { questionId, explanation } })
    return saved.explanation
  }

  return { saveExplanation }
}
