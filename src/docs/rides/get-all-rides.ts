/**
 * @swagger
 * /rides?pageSize={pageSize}&pageNumber={pageNumber}:
 *   get:
 *     summary: Retrieve all rides
 *     description: Retrieve all rides
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           description: The number of items to return.
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           description: The page you are trying to retrieve (ex. 1, 2, 3)
 *     responses:
 *       200:
 *         description: List of rides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
