import { useEffect, useState } from 'react';
import { useActor } from './useActor';
import { TripType } from '@/backend';

interface UseFareCalculationParams {
  tripType: TripType;
  pickupLocation: string;
  dropLocation: string;
  durationHours?: number;
}

export function useFareCalculation({
  tripType,
  pickupLocation,
  dropLocation,
  durationHours,
}: UseFareCalculationParams) {
  const { actor, isFetching: isActorFetching } = useActor();
  const [fare, setFare] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const calculateFare = async () => {
      if (!actor || isActorFetching) return;

      // Validate required fields based on trip type
      if (!pickupLocation) {
        setFare(null);
        return;
      }

      if (tripType === TripType.pointToPoint || tripType === TripType.airportTransfer) {
        if (!dropLocation) {
          setFare(null);
          return;
        }
      }

      if (tripType === TripType.byTheHour && !durationHours) {
        setFare(null);
        return;
      }

      setIsCalculating(true);
      try {
        const calculatedFare = await actor.calculateFare(
          tripType,
          { address: pickupLocation },
          (tripType === TripType.pointToPoint || tripType === TripType.airportTransfer) 
            ? { address: dropLocation } 
            : null,
          tripType === TripType.byTheHour ? (durationHours ?? null) : null
        );
        setFare(calculatedFare);
      } catch (error) {
        console.error('Error calculating fare:', error);
        setFare(null);
      } finally {
        setIsCalculating(false);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculateFare, 500);
    return () => clearTimeout(timeoutId);
  }, [actor, isActorFetching, tripType, pickupLocation, dropLocation, durationHours]);

  return { fare, isCalculating };
}
