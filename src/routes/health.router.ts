import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка здоровья сервера
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервер работает корректно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 */

router.get('/', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default router;
