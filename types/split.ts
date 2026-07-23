export interface Participant {
  id: string;
  name: string;
  requestedMl: number;
}

export interface FragranceDetails {
  name: string;
  bottleSize: number;
  bottlePrice: number;
  shippingCost: number;
  notes?: string;
}

export interface CostBreakdown {
  totalCost: number;
  costPerMl: number;
  participantCosts: ParticipantCost[];
  allocatedMl: number;
  remainingMl: number;
}

export interface ParticipantCost {
  participant: Participant;
  cost: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ParticipantSummary {
  participantId: string;
  name: string;
  text: string;
}
