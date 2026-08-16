import type { Todo, TodoId } from '@todo/shared';

export function createTodos(initial: Todo[]) {
  let list = initial;
  const add = (todo: Todo) => {
    list = [...list, todo];
  };
  const hasId = (id: TodoId) => list.some((t) => t.id === id);
  const update = (id: TodoId, isDone: boolean) => {
    list = list.map((t) => (t.id === id ? { ...t, ['isDone']: isDone } : t));
  };
  const remove = (id: TodoId) => {
    list = list.filter((t) => t.id !== id);
  };

  return {
    get list() {
      return list;
    },
    add,
    hasId,
    update,
    remove
  };
}
