'use client';

import React from 'react';
import { useAppStateStore } from '@/store';
import { Checkbox } from './ui/checkbox';

export function ColumnToggles() {
  const { state, setState } = useAppStateStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-quantity"
          checked={state.showQuantity}
          onCheckedChange={(checked) => setState('showQuantity', !!checked)}
        />
        <label
          htmlFor="show-quantity"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Quantity Column
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-price"
          checked={state.showPrice}
          onCheckedChange={(checked) => setState('showPrice', !!checked)}
        />
        <label
          htmlFor="show-price"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Price Column
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-subtotal"
          checked={state.showSubtotal}
          onCheckedChange={(checked) => setState('showSubtotal', !!checked)}
        />
        <label
          htmlFor="show-subtotal"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Subtotal
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-tax"
          checked={state.showTax}
          onCheckedChange={(checked) => setState('showTax', !!checked)}
        />
        <label
          htmlFor="show-tax"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Tax
        </label>
      </div>
    </div>
  );
}
