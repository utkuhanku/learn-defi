export function healthFactor(
  collateralUsd: number,
  liquidationThreshold: number,
  borrowUsd: number,
): number {
  if (borrowUsd === 0) return Infinity
  return (collateralUsd * liquidationThreshold) / borrowUsd
}

export function liquidationPrice(
  collateralAmount: number,
  liquidationThreshold: number,
  borrowUsd: number,
): number {
  if (collateralAmount * liquidationThreshold === 0) return Infinity
  return borrowUsd / (collateralAmount * liquidationThreshold)
}
