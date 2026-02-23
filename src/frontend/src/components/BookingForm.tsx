import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TripTypeSelector from './TripTypeSelector';
import LocationInput from './LocationInput';
import DateTimePicker from './DateTimePicker';
import FareEstimate from './FareEstimate';
import { useFareCalculation } from '@/hooks/useFareCalculation';
import { useCreateBooking } from '@/hooks/useQueries';
import { TripType } from '@/backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function BookingForm() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>(TripType.pointToPoint);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [durationHours, setDurationHours] = useState<number>(4);

  const { fare, isCalculating } = useFareCalculation({
    tripType,
    pickupLocation,
    dropLocation,
    durationHours: tripType === TripType.byTheHour ? durationHours : undefined,
  });

  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();

  const isFormValid = () => {
    if (!pickupLocation || !pickupDate || !pickupTime) return false;
    
    if (tripType === TripType.pointToPoint || tripType === TripType.airportTransfer) {
      if (!dropLocation) return false;
    }
    
    if (tripType === TripType.airportTransfer) {
      if (!returnDate || !returnTime) return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (fare === null) {
      toast.error('Unable to calculate fare. Please try again.');
      return;
    }

    const bookingData = {
      tripType,
      pickupLocation: { address: pickupLocation },
      dropoffLocation: (tripType === TripType.pointToPoint || tripType === TripType.airportTransfer) 
        ? { address: dropLocation } 
        : null,
      pickupDate,
      pickupTime,
      durationHours: tripType === TripType.byTheHour ? durationHours : null,
      fare,
    };

    createBooking(bookingData, {
      onSuccess: (bookingId) => {
        toast.success('Booking created successfully!');
        navigate({ to: '/confirmation/$bookingId', params: { bookingId: bookingId.toString() } });
      },
      onError: (error) => {
        toast.error('Failed to create booking. Please try again.');
        console.error('Booking error:', error);
      },
    });
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center">
          Book Your Ride
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Fill in the details below to reserve your cab
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type Selection */}
          <TripTypeSelector value={tripType} onChange={setTripType} />

          {/* Location Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <LocationInput
              label="Pickup Location"
              placeholder="Enter pickup address"
              value={pickupLocation}
              onChange={setPickupLocation}
              required
            />
            
            {(tripType === TripType.pointToPoint || tripType === TripType.airportTransfer) && (
              <LocationInput
                label="Drop Location"
                placeholder="Enter drop address"
                value={dropLocation}
                onChange={setDropLocation}
                required
              />
            )}
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <DateTimePicker
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={setPickupDate}
              required
            />
            <DateTimePicker
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={setPickupTime}
              required
            />
          </div>

          {/* Return Date/Time for Round Trip */}
          {tripType === TripType.airportTransfer && (
            <div className="grid md:grid-cols-2 gap-4">
              <DateTimePicker
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={setReturnDate}
                minDate={pickupDate}
                required
              />
              <DateTimePicker
                label="Return Time"
                type="time"
                value={returnTime}
                onChange={setReturnTime}
                required
              />
            </div>
          )}

          {/* Duration for Local Rental */}
          {tripType === TripType.byTheHour && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (Hours) <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-lg font-semibold min-w-[4rem] text-center">
                  {durationHours}h
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Select rental duration between 2 to 12 hours
              </p>
            </div>
          )}

          {/* Fare Estimate */}
          <FareEstimate fare={fare} isCalculating={isCalculating} />

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-lg h-14"
            disabled={!isFormValid() || isCreating || isCalculating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
