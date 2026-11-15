export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = synth.getVoices()
  const pick =
    voices.find(
      (voice) =>
        /^en(-|_)/i.test(voice.lang) &&
        /(samantha|zira|aria|jenny|female|google us english)/i.test(voice.name)
    ) ?? voices.find((voice) => /^en(-|_)/i.test(voice.lang))
  if (pick) utterance.voice = pick
  utterance.rate = 0.98
  utterance.pitch = 1.08
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
