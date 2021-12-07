/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Create a ride
 *     description: Create a ride
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_lat:
 *                 type: number
 *                 description: Start latitude of the ride, values should be in -90 - 90
 *                 example: 90
 *               start_long:
 *                 type: number
 *                 description: Start longitude of the ride, values should be in -180 - 180
 *                 example: 100
 *               end_lat:
 *                 type: number
 *                 description: End latitude of the ride, values should be in -90 - 90
 *                 example: 90
 *               end_long:
 *                 type: number
 *                 description: End longitude of the ride, values should be in -180 - 180
 *                 example: 100
 *               rider_name:
 *                 type: string
 *                 description: Rider alias
 *                 example: 'Dylan'
 *               driver_name:
 *                 type: string
 *                 description: Full name of driver
 *                 example: 'Brad Pitt'
 *               driver_vehicle:
 *                 type: string
 *                 description: Driver vehicle
 *                 example: 'Vehicle'
 *     responses:
 *       200:
 *         description: Ride details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
