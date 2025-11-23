import { Router } from 'express';

import {
  createCategory,
  listCategories,
  updateCategory,
  removeCategory,
} from '../services/todos.service';

const router = Router();

// ... остальной код без изменений

// Получить все категории
router.get('/', (_req, res) => {
  res.json(listCategories());
});

// Создать категорию
router.post('/', (req, res) => {
  const { name, color } = req.body ?? {};

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const category = createCategory(name.trim(), color);
  res.status(201).json(category);
});

// Обновить категорию
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, color } = req.body ?? {};

  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const category = updateCategory(id, name.trim(), color);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(category);
});

// Удалить категорию
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  const success = removeCategory(id);
  if (!success) {
    return res.status(400).json({
      error: 'Cannot delete category with existing todos',
    });
  }

  res.status(204).send();
});

export default router;
