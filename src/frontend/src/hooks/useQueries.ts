import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TripType, Location } from '@/backend';

interface CreateBookingParams {
  tripType: TripType;
  pickupLocation: Location;
  dropoffLocation: Location | null;
  pickupDate: string;
  pickupTime: string;
  durationHours: number | null;
  fare: number;
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.createBooking(
        params.tripType,
        params.pickupLocation,
        params.dropoffLocation,
        params.pickupDate,
        params.pickupTime,
        params.durationHours,
        params.fare
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
