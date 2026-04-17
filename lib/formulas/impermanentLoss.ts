export function impermanentLoss(priceRatio: number): number {
  return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1
}

export function lpValue(
  initialValue: number,
  priceRatioA: number,
  priceRatioB: number = 1,
): { lpValue: number; holdValue: number; ilPercent: number } {
  const ratio = priceRatioA / priceRatioB
  const ilPercent = impermanentLoss(ratio)
  const holdValue = (initialValue * (priceRatioA + priceRatioB)) / 2
  const lp = holdValue * (1 + ilPercent)
  return { lpValue: lp, holdValue, ilPercent }
}
