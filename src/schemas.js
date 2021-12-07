"use strict";

const logger = require("./library/logger");

module.exports = async (db) => {
  return new Promise((resolve, reject) => {
    try {
      const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
	@@ -15,8 +19,12 @@ module.exports = (db) => {
        created DATETIME default CURRENT_TIMESTAMP
        )
    `;
      db.run(createRideTableSchema);
      resolve(db);
    } catch (error) {
      console.log("error here", error);
      logger.error(error);
      reject(error)
    }
  });
};