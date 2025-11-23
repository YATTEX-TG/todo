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

// Получить все задачи (с фильтрацией по категории)
router.get('/', (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

  if (req.query.categoryId && !Number.isFinite(categoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  res.json(listTodos(categoryId));
});

// Создать задачу
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

// Обновить заголовок задачи
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

// Обновить категорию задачи
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

// Существующие endpoints оставляем без изменений
router.post('/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid ID' });

  const todo = toggleTodo(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid ID' });

  const ok = removeTodo(id);
  if (!ok) return res.status(404).json({ error: 'Todo not found' });

  res.status(204).send();
});

export default router;
