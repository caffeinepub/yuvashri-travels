import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type TripType = {
    #airportTransfer;
    #byTheHour;
    #pointToPoint;
  };

  module TripType {
    public func compare(t1 : TripType, t2 : TripType) : Order.Order {
      switch (t1, t2) {
        case (#airportTransfer, #byTheHour) { #less };
        case (#airportTransfer, #pointToPoint) { #less };
        case (#byTheHour, #airportTransfer) { #greater };
        case (#byTheHour, #pointToPoint) { #less };
        case (#pointToPoint, #airportTransfer) { #greater };
        case (#pointToPoint, #byTheHour) { #greater };
        case (_, _) { #equal };
      };
    };
  };

  type Location = {
    address : Text;
  };

  module Location {
    public func compare(l1 : Location, l2 : Location) : Order.Order {
      Text.compare(l1.address, l2.address);
    };
  };

  type Booking = {
    id : Nat;
    tripType : TripType;
    pickupLocation : Location;
    dropoffLocation : ?Location; // Nullable for byTheHour trips
    pickupDate : Text;
    pickupTime : Text;
    durationHours : ?Float; // Nullable for non-hourly trips
    fare : Float;
  };

  module Booking {
    public func compareByFare(b1 : Booking, b2 : Booking) : Order.Order {
     Float.compare(b1.fare, b2.fare);
    };
  };

  var nextBookingId = 0;
  let bookings = Map.empty<Nat, Booking>();

  public shared ({ caller }) func calculateFare(
    tripType : TripType,
    pickupLocation : Location,
    dropoffLocation : ?Location,
    durationHours : ?Float,
  ) : async Float {
    var fare = 50.0;

    switch (tripType) {
      case (#byTheHour) {
        switch (durationHours) {
          case (?hours) {
            fare := fare + (hours * 30.0);
          };
          case (null) { Runtime.trap("Duration required for hourly trips") };
        };
      };
      case (#pointToPoint) {
        fare += 20.0;
      };
      case (#airportTransfer) {
        fare += 15.0;
      };
    };

    fare;
  };

  public shared ({ caller }) func createBooking(
    tripType : TripType,
    pickupLocation : Location,
    dropoffLocation : ?Location,
    pickupDate : Text,
    pickupTime : Text,
    durationHours : ?Float,
    fare : Float,
  ) : async Nat {
    let booking : Booking = {
      id = nextBookingId;
      tripType;
      pickupLocation;
      dropoffLocation;
      pickupDate;
      pickupTime;
      durationHours;
      fare;
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.id;
  };

  public query ({ caller }) func getBooking(id : Nat) : async Booking {
    switch (bookings.get(id)) {
      case (?booking) { booking };
      case (null) { Runtime.trap("Booking does not exist") };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public query ({ caller }) func getBookingsBelowFare(fareLimit : Float) : async [Booking] {
    let filtered = bookings.values().toArray().filter(
      func(b) { b.fare < fareLimit }
    );
    filtered.sort(Booking.compareByFare);
  };
};
