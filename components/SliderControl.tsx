import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export default function SliderControl({ label, value, min, max, step, onChange }: SliderControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground">{label}</Label>
        <span className="text-xs font-mono text-foreground font-medium">{value}</span>
      </div>
      <Slider 
        min={min} 
        max={max} 
        step={step} 
        value={[value]} 
        onValueChange={(vals) => {
          if (Array.isArray(vals)) onChange(vals[0]);
          else onChange(vals as unknown as number);
        }} 
        className="w-full"
      />
    </div>
  );
}
