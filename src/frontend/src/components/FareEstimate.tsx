import { Card } from '@/components/ui/card';
import { IndianRupee, Loader2 } from 'lucide-react';

interface FareEstimateProps {
  fare: number | null;
  isCalculating: boolean;
}

export default function FareEstimate({ fare, isCalculating }: FareEstimateProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Estimated Fare</p>
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-lg font-medium">Calculating...</span>
              </div>
            ) : fare !== null ? (
              <div className="flex items-center gap-1">
                <IndianRupee className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-primary">{fare.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg text-muted-foreground">Enter details to calculate</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Base fare included</p>
            <p className="text-xs text-muted-foreground">Final fare may vary</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
