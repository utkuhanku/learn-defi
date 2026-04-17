export function deltaNeutralApy(params: {
  supplyApr: number
  borrowApr: number
  fundingRate: number
  leverage: number
}): {
  netApy: number
  supplyYield: number
  borrowCost: number
  fundingYield: number
} {
  const { supplyApr, borrowApr, fundingRate, leverage } = params
  const supplyYield = supplyApr * leverage
  const borrowCost = borrowApr * (leverage - 1)
  const fundingYield = fundingRate * (leverage - 1)
  const netApy = supplyYield - borrowCost + fundingYield
  return { netApy, supplyYield, borrowCost, fundingYield }
}
