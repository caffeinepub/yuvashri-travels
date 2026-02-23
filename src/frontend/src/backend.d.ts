import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    address: string;
}
export interface Booking {
    id: bigint;
    tripType: TripType;
    dropoffLocation?: Location;
    fare: number;
    durationHours?: number;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: Location;
}
export enum TripType {
    byTheHour = "byTheHour",
    pointToPoint = "pointToPoint",
    airportTransfer = "airportTransfer"
}
export interface backendInterface {
    calculateFare(tripType: TripType, pickupLocation: Location, dropoffLocation: Location | null, durationHours: number | null): Promise<number>;
    createBooking(tripType: TripType, pickupLocation: Location, dropoffLocation: Location | null, pickupDate: string, pickupTime: string, durationHours: number | null, fare: number): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(id: bigint): Promise<Booking>;
    getBookingsBelowFare(fareLimit: number): Promise<Array<Booking>>;
}
