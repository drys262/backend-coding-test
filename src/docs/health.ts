/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check of the API
 *     description: Health check of the API
 *     responses:
 *       200:
 *         description: Returns an object if server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The message returned by the health check
 */