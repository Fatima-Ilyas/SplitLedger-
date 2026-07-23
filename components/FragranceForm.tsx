import React from 'react';
import { Card, Input } from '@/components/ui';
import { FragranceDetails, ValidationError } from '@/types';
import { FlaskConical } from 'lucide-react';

interface FragranceFormProps {
  fragrance: FragranceDetails;
  onChange: (fragrance: FragranceDetails) => void;
  errors: ValidationError[];
  showErrors?: boolean;
}

export function FragranceForm({ fragrance, onChange, errors, showErrors = false }: FragranceFormProps) {
  const getError = (field: string) => showErrors ? errors.find((e) => e.field === field)?.message : undefined;

  const handleChange = (field: keyof FragranceDetails, value: string | number) => {
    onChange({ ...fragrance, [field]: value });
  };

  return (
    <Card className="p-6 md:p-7">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
          <FlaskConical className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Fragrance Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter the bottle details and costs below.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label="Fragrance Name"
            placeholder="e.g. Creed Aventus"
            value={fragrance.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={getError('name')}
            required
          />
        </div>

        <Input
          label="Bottle Size (ml)"
          type="number"
          min="1"
          step="1"
          placeholder="100"
          value={fragrance.bottleSize || ''}
          onChange={(e) => handleChange('bottleSize', parseFloat(e.target.value) || 0)}
          error={getError('bottleSize')}
          required
        />

        <Input
          label="Bottle Price ($)"
          type="number"
          min="0"
          step="0.01"
          placeholder="350.00"
          value={fragrance.bottlePrice || ''}
          onChange={(e) => handleChange('bottlePrice', parseFloat(e.target.value) || 0)}
          error={getError('bottlePrice')}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Shipping Cost ($)"
            type="number"
            min="0"
            step="0.01"
            placeholder="15.00"
            value={fragrance.shippingCost || ''}
            onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value) || 0)}
            error={getError('shippingCost')}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
          <label htmlFor="notes" className="text-xs font-medium text-slate-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all hover:border-slate-300 shadow-2xs resize-none"
            placeholder="Any additional information..."
            value={fragrance.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
