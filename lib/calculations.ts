import { FragranceDetails, Participant, CostBreakdown } from '@/types';

export function calculateCostBreakdown(
  fragrance: FragranceDetails,
  participants: Participant[]
): CostBreakdown {
  const totalCost = (fragrance.bottlePrice || 0) + (fragrance.shippingCost || 0);
  
  // Prevent division by zero
  const costPerMl = fragrance.bottleSize > 0 ? totalCost / fragrance.bottleSize : 0;
  
  const allocatedMl = participants.reduce((sum, p) => sum + (p.requestedMl || 0), 0);
  const remainingMl = (fragrance.bottleSize || 0) - allocatedMl;

  const participantCosts = participants.map((p) => ({
    participant: p,
    cost: (p.requestedMl || 0) * costPerMl,
  }));

  return {
    totalCost,
    costPerMl,
    participantCosts,
    allocatedMl,
    remainingMl,
  };
}
