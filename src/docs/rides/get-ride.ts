/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Retrieve a specific ride.
 *     description: Retrieve a specific ride.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the ride to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single ride
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
