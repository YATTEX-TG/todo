import { createTodo, listTodos, toggleTodo, removeTodo } from '../src/services/todos.service';

describe('todos service', () => {
  beforeEach(() => {
    // Очищаем хранилище перед каждым тестом
    const all = listTodos();
    all.forEach(todo => removeTodo(todo.id));
  });

  test('create and list', () => {
    const t = createTodo('learn ts');
    expect(t.id).toBeGreaterThan(0);
    const all = listTodos();
    expect(all.some((x: { id: number; title: string; done: boolean }) => 
      x.id === t.id && x.title === 'learn ts' && x.done === false
    )).toBe(true);
  });

  test('toggle', () => {
    const t = createTodo('toggle me');
    const toggled = toggleTodo(t.id);
    expect(toggled?.done).toBe(true);
  });

  test('remove', () => {
    const t = createTodo('remove me');
    const ok = removeTodo(t.id);
    expect(ok).toBe(true);
  });
});