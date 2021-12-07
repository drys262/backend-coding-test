export type Ride = {
  rideID?: number;
  startLat: number;
  startLong: number;
  endLat: number;
  endLong: number;
  riderName: string;
  driverName: string;
  driverVehicle: string;
  created: Date;
};
