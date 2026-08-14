import type { Todo, TodoId } from '@todo/shared';

export function createTodos(initial: Todo[]) {
  let state = initial;
  const add = (todo: Todo) => {
    state = [...state, todo];
  };
  const find = (id: TodoId) => state.some((t) => t.id === id);
  const update = (id: TodoId, isDone: boolean) => {
    state = state.map((t) => (t.id === id ? { ...t, ['isDone']: isDone } : t));
  };
  const remove = (id: TodoId) => {
    state = state.filter((t) => t.id !== id);
  };

  return {
    get state() {
      return state;
    },
    add,
    find,
    update,
    remove
  };
}
