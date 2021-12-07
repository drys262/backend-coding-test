import { Ride } from '../../src/types';
import chance from './chance';

export default (): Ride => ({
  created: chance.date(),
  driverName: chance.name(),
  driverVehicle: chance.name(),
  endLat: chance.latitude(),
  endLong: chance.longitude(),
  riderName: chance.name(),
  startLat: chance.latitude(),
  startLong: chance.longitude(),
});