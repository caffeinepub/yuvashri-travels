import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import BookingHeader from '@/components/BookingHeader';
import Footer from '@/components/Footer';
import { TripType } from '@/backend';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams({ from: '/confirmation/$bookingId' });
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBooking(BigInt(bookingId));
    },
    enabled: !!actor && !isActorFetching,
  });

  const getTripTypeLabel = (tripType: TripType) => {
    switch (tripType) {
      case TripType.pointToPoint:
        return 'One-Way Trip';
      case TripType.airportTransfer:
        return 'Round Trip';
      case TripType.byTheHour:
        return 'Local Rental';
      default:
        return 'Trip';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <BookingHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading booking details...</p>
                </div>
              </CardContent>
            </Card>
          ) : booking ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-muted-foreground">
                  Your booking has been successfully created. We'll contact you shortly.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                    <p className="font-semibold text-lg">#{booking.id.toString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trip Type</p>
                    <p className="font-medium">{getTripTypeLabel(booking.tripType)}</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Location</p>
                        <p className="font-medium">{booking.pickupLocation.address}</p>
                      </div>
                    </div>

                    {booking.dropoffLocation && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Drop Location</p>
                          <p className="font-medium">{booking.dropoffLocation.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Date</p>
                        <p className="font-medium">{booking.pickupDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Time</p>
                        <p className="font-medium">{booking.pickupTime}</p>
                      </div>
                    </div>
                  </div>

                  {booking.durationHours && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-medium">{booking.durationHours} hours</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Total Fare</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{booking.fare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => navigate({ to: '/' })}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Book Another Ride
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Booking not found</p>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  className="mt-4"
                >
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
