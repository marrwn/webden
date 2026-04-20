import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex gap-2 items-center">
        <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer p-0 border-0"
          />
        </div>
        <Input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="uppercase font-mono text-xs max-w-full h-9"
        />
      </div>
    </div>
  );
}
