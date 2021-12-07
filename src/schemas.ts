import { Database } from 'sqlite3';

import logger from './library/logger';

export default async (db: Database): Promise<Database> => new Promise((resolve, reject) => {
  try {
    const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
        )
    `;
    db.run(createRideTableSchema);
    resolve(db);
  } catch (error) {
    logger.error(error);
    reject(error);
  }
});
