export function aprToApy(apr: number, compoundsPerYear: number): number {
  if (compoundsPerYear === Infinity) return Math.exp(apr) - 1
  return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1
}

export function apyToApr(apy: number, compoundsPerYear: number): number {
  if (compoundsPerYear === Infinity) return Math.log(1 + apy)
  return compoundsPerYear * (Math.pow(1 + apy, 1 / compoundsPerYear) - 1)
}
