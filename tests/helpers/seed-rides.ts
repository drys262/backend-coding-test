import { Database } from "sqlite3";

import logger from "../../src/library/logger";
import generateRide from "./generate-ride";

export default (db: Database): void => {
  [...Array(10)].forEach(() => {
    const rideData = generateRide();

    const values = [
      rideData.startLat,
      rideData.startLong,
      rideData.endLat,
      rideData.endLong,
      rideData.riderName,
      rideData.driverName,
      rideData.driverVehicle,
    ];

    db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
      function (err) {
        if (err) {
          logger.error(err);
        }
      }
    );
  });
};
