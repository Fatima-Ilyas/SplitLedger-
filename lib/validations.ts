import { FragranceDetails, Participant, ValidationError } from '@/types';

export function validateFragrance(fragrance: FragranceDetails): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!fragrance.name || fragrance.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Fragrance name is required (min 2 characters)' });
  }

  if (!fragrance.bottleSize || fragrance.bottleSize <= 0) {
    errors.push({ field: 'bottleSize', message: 'Bottle size must be greater than 0' });
  } else if (fragrance.bottleSize > 1000) {
    errors.push({ field: 'bottleSize', message: 'Bottle size cannot exceed 1000ml' });
  }

  if (!fragrance.bottlePrice || fragrance.bottlePrice <= 0) {
    errors.push({ field: 'bottlePrice', message: 'Bottle price must be greater than 0' });
  } else if (fragrance.bottlePrice > 10000) {
    errors.push({ field: 'bottlePrice', message: 'Bottle price cannot exceed $10,000' });
  }

  if (fragrance.shippingCost < 0) {
    errors.push({ field: 'shippingCost', message: 'Shipping cost cannot be negative' });
  }

  return errors;
}

export function validateParticipants(
  participants: Participant[],
  bottleSize: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (participants.length === 0) {
    errors.push({ field: 'participants', message: 'At least one participant is required' });
    return errors;
  }

  participants.forEach((p, index) => {
    if (!p.name || p.name.trim().length < 2) {
      errors.push({
        field: `participant-${p.id}-name`,
        message: `Participant ${index + 1}: Name is required`,
      });
    }

    if (!p.requestedMl || p.requestedMl <= 0) {
      errors.push({
        field: `participant-${p.id}-ml`,
        message: `Participant ${index + 1}: Quantity must be greater than 0`,
      });
    }
  });

  const totalRequested = participants.reduce((sum, p) => sum + (p.requestedMl || 0), 0);
  if (bottleSize > 0 && totalRequested > bottleSize) {
    errors.push({
      field: 'allocation',
      message: `Total requested ml (${totalRequested}ml) exceeds bottle size (${bottleSize}ml)`,
    });
  }

  return errors;
}
