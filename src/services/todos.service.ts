export type Todo = {
  id: number;
  title: string;
  done: boolean;
  categoryId?: number; // ID категории (опционально)
  createdAt: Date; // Дата создания
  updatedAt: Date; // Дата последнего обновления
};

export type Category = {
  id: number;
  name: string;
  color?: string; // Цвет категории (опционально)
  createdAt: Date;
};

let todoSeq = 1;
let categorySeq = 1;
const todoStore = new Map<number, Todo>();
const categoryStore = new Map<number, Category>();

// Функция для обновления времени
function updateTodoTimestamp(todo: Todo): Todo {
  todo.updatedAt = new Date();
  return todo;
}

// ВСТАВЬТЕ СЮДА ВАШ КОД С ФУНКЦИЯМИ
export function listTodos(categoryId?: number): Todo[] {
  let todos = Array.from(todoStore.values());

  // Фильтрация по категории если указана
  if (categoryId !== undefined) {
    todos = todos.filter((todo) => todo.categoryId === categoryId);
  }

  return todos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function createTodo(title: string, categoryId?: number): Todo {
  const now = new Date();
  const todo: Todo = {
    id: todoSeq++,
    title,
    done: false,
    categoryId,
    createdAt: now,
    updatedAt: now,
  };
  todoStore.set(todo.id, todo);
  return todo;
}

export function toggleTodo(id: number): Todo | null {
  const t = todoStore.get(id);
  if (!t) return null;

  t.done = !t.done;
  return updateTodoTimestamp(t);
}

export function updateTodoTitle(id: number, title: string): Todo | null {
  const t = todoStore.get(id);
  if (!t) return null;

  t.title = title;
  return updateTodoTimestamp(t);
}

export function updateTodoCategory(id: number, categoryId?: number): Todo | null {
  const t = todoStore.get(id);
  if (!t) return null;

  t.categoryId = categoryId;
  return updateTodoTimestamp(t);
}

export function removeTodo(id: number): boolean {
  return todoStore.delete(id);
}

// ДОБАВЬТЕ ФУНКЦИИ ДЛЯ КАТЕГОРИЙ ПОСЛЕ ЭТОГО
export function listCategories(): Category[] {
  return Array.from(categoryStore.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function createCategory(name: string, color?: string): Category {
  const category: Category = {
    id: categorySeq++,
    name,
    color,
    createdAt: new Date(),
  };
  categoryStore.set(category.id, category);
  return category;
}

export function updateCategory(id: number, name: string, color?: string): Category | null {
  const category = categoryStore.get(id);
  if (!category) return null;

  category.name = name;
  category.color = color;
  return category;
}

export function removeCategory(id: number): boolean {
  // Проверяем есть ли задачи с этой категорией
  const todosWithCategory = Array.from(todoStore.values()).filter((todo) => todo.categoryId === id);

  if (todosWithCategory.length > 0) {
    return false; // Нельзя удалить категорию с задачами
  }

  return categoryStore.delete(id);
}
