import BookingHeader from '@/components/BookingHeader';
import BookingForm from '@/components/BookingForm';
import Footer from '@/components/Footer';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <BookingHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/assets/generated/hero-background.dim_1920x600.jpg"
              alt="Yuvashri Travels"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                Your Journey, Our Priority
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Book reliable, comfortable cab services for all your travel needs. 
                Available 24/7 with professional drivers.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section className="container mx-auto px-4 -mt-20 pb-16 relative z-10">
          <BookingForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
