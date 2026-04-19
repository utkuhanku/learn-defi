/** Returns a time-of-day greeting appropriate for a crypto-native audience. */
export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'gn'
  if (h < 12) return 'gm'
  if (h < 18) return 'hey'
  if (h < 22) return 'evening'
  return 'gn'
}
