import { Router } from 'express';

import {
  createTodo,
  listTodos,
  removeTodo,
  toggleTodo,
  updateTodoTitle,
  updateTodoCategory,
} from '../services/todos.service';

const router = Router();

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Получить список всех задач
 *     description: Возвращает список задач с возможностью фильтрации по категории
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: ID категории для фильтрации задач
 *         example: 1
 *     responses:
 *       200:
 *         description: Успешный возврат списка задач
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверный ID категории
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

  if (req.query.categoryId && !Number.isFinite(categoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  res.json(listTodos(categoryId));
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Создать новую задачу
 *     description: Создает новую задачу с указанным заголовком и категорией
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок задачи
 *                 example: "Изучить TypeScript"
 *               categoryId:
 *                 type: integer
 *                 description: ID категории (опционально)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Задача успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => {
  const { title, categoryId } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validCategoryId = categoryId !== undefined ? Number(categoryId) : undefined;

  if (categoryId !== undefined && !Number.isFinite(validCategoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  const todo = createTodo(title.trim(), validCategoryId);
  res.status(201).json(todo);
});

/**
 * @swagger
 * /api/todos/{id}/title:
 *   put:
 *     summary: Обновить заголовок задачи
 *     description: Обновляет заголовок существующей задачи
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID задачи
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Новый заголовок задачи
 *                 example: "Обновленный заголовок задачи"
 *     responses:
 *       200:
 *         description: Заголовок задачи успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задача не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/title', (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body ?? {};

  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = updateTodoTitle(id, title.trim());
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

/**
 * @swagger
 * /api/todos/{id}/category:
 *   put:
 *     summary: Обновить категорию задачи
 *     description: Изменяет категорию существующей задачи
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID задачи
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: ID новой категории (null для удаления категории)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Категория задачи успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задача не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/category', (req, res) => {
  const id = Number(req.params.id);
  const { categoryId } = req.body ?? {};

  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  const validCategoryId = categoryId !== undefined ? Number(categoryId) : undefined;

  if (categoryId !== undefined && !Number.isFinite(validCategoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  const todo = updateTodoCategory(id, validCategoryId);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   post:
 *     summary: Переключить статус выполнения задачи
 *     description: Изменяет статус выполнения задачи (выполнена/не выполнена)
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID задачи
 *         example: 1
 *     responses:
 *       200:
 *         description: Статус задачи успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверный ID задачи
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задача не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid ID' });

  const todo = toggleTodo(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  res.json(todo);
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     description: Удаляет задачу по ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID задачи для удаления
 *         example: 1
 *     responses:
 *       204:
 *         description: Задача успешно удалена
 *       400:
 *         description: Неверный ID задачи
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Задача не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid ID' });

  const ok = removeTodo(id);
  if (!ok) return res.status(404).json({ error: 'Todo not found' });

  res.status(204).send();
});

export default router;
