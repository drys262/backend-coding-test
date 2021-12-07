/**
   * @swagger
   * components:
   *   schemas:
   *     Ride:
   *       type: object
   *       properties:
   *         rideId:
   *           type: integer
   *           description: Unique identifier of the ride.
   *           example: 1
   *         startLat:
   *           type: integer
   *           description: Start latitude of the ride, values should be in -90 - 90
   *           example: 100
   *         startLong:
   *           type: integer
   *           description: Start longitude of the ride, values should be in -180 - 180
   *           example: 180
   *         endLat:
   *           type: integer
   *           description: End latitude of the ride, values should be in -90 - 90
   *           example: 100
   *         endLong:
   *           type: integer
   *           description: End longitude of the ride, values should be in -180 - 180
   *           example: 180
   *         riderName:
   *           type: string
   *           description: Rider alias
   *           example: 'Dylan'
   *         driverName:
   *           type: string
   *           description: Full name of drive
   *           example: 'Brad Pitt'
   *         driverVehicle:
   *           type: string
   *           description: Driver vehicle
   *           example: 'Vehicle'
   *         created:
   *           type: string
   *           description: The response timestamp
   *           example: '2021-09-14 22:11:58'
   */