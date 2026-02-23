import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  type: 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minDate?: string;
}

export default function DateTimePicker({
  label,
  type,
  value,
  onChange,
  required = false,
  minDate,
}: DateTimePickerProps) {
  const today = new Date().toISOString().split('T')[0];
  const min = type === 'date' ? (minDate || today) : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        {type === 'date' ? (
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        ) : (
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
          className="pl-10 h-11"
        />
      </div>
    </div>
  );
}
