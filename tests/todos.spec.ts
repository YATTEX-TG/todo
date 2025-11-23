import {
  createTodo,
  listTodos,
  toggleTodo,
  removeTodo,
  createCategory,
  listCategories,
  removeCategory,
} from '../src/services/todos.service';

describe('todos service', () => {
  beforeEach(() => {
    // Очищаем хранилище перед каждым тестом
    const allTodos = listTodos();
    allTodos.forEach((todo) => removeTodo(todo.id));

    const allCategories = listCategories();
    allCategories.forEach((category) => removeCategory(category.id));
  });

  test('create and list todos with timestamps', () => {
    const t = createTodo('learn ts');
    expect(t.id).toBeGreaterThan(0);
    expect(t.createdAt).toBeInstanceOf(Date);
    expect(t.updatedAt).toBeInstanceOf(Date);

    const all = listTodos();
    expect(all.some((x) => x.id === t.id && x.title === 'learn ts')).toBe(true);
  });

  test('toggle updates timestamp', async () => {
    const t = createTodo('toggle me');
    const originalTime = t.updatedAt.getTime();

    // Добавляем небольшую задержку чтобы время точно изменилось
    await new Promise((resolve) => setTimeout(resolve, 10));

    const toggled = toggleTodo(t.id);
    expect(toggled?.done).toBe(true);
    expect(toggled?.updatedAt.getTime()).toBeGreaterThan(originalTime);
  });

  test('create and manage categories', () => {
    const category = createCategory('Work', '#ff0000');
    expect(category.id).toBeGreaterThan(0);
    expect(category.name).toBe('Work');
    expect(category.color).toBe('#ff0000');

    const todo = createTodo('Work task', category.id);
    expect(todo.categoryId).toBe(category.id);

    const workTodos = listTodos(category.id);
    expect(workTodos).toHaveLength(1);
    expect(workTodos[0].title).toBe('Work task');
  });
});
