export default function BookingHeader() {
  return (
    <header className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/yuvashri-logo.dim_200x80.png"
            alt="Yuvashri Travels"
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Yuvashri Travels</h1>
            <p className="text-xs text-muted-foreground">Your Trusted Travel Partner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
