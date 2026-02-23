import { TripType } from '@/backend';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowLeftRight, Clock } from 'lucide-react';

interface TripTypeSelectorProps {
  value: TripType;
  onChange: (value: TripType) => void;
}

export default function TripTypeSelector({ value, onChange }: TripTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Trip Type <span className="text-destructive">*</span>
      </label>
      <Tabs value={value} onValueChange={(v) => onChange(v as TripType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger 
            value={TripType.pointToPoint} 
            className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">One-Way</span>
          </TabsTrigger>
          <TabsTrigger 
            value={TripType.airportTransfer}
            className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Round Trip</span>
          </TabsTrigger>
          <TabsTrigger 
            value={TripType.byTheHour}
            className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Local Rental</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
