import type { Result, Todo, InputTodo, TodoId } from '@todo/shared';
import type { TodoRepository, TodoRepositoryError } from './type.ts';

export function createIdCounter() {
  let id = 0;

  return {
    count: () => {
      const current = id;
      id++;
      return current as TodoId;
    },

    reset: () => {
      id = 0;
    }
  };
}

/**
 * 必ず成功する（Ok の Result を返す）TODO Mock Repo を作成する
 * @param initial id のない TODO
 * @param idCounter カウンタオブジェクト
 * @returns Mock Repo
 */
export function createMockSuccessTodoRepository(
  initial: Omit<Todo, 'id'>[],
  idCounter: ReturnType<typeof createIdCounter>
): TodoRepository {
  let todos: Todo[] = initial.map((t) => ({ ...t, id: idCounter.count() }));

  const create = async (newTodo: InputTodo): Promise<Result<Todo, TodoRepositoryError>> => {
    const data = { ...newTodo, id: idCounter.count(), isDone: false };
    todos = [...todos, data];
    return {
      ok: true,
      data
    };
  };

  const findAll = async (): Promise<Result<Todo[], TodoRepositoryError>> => ({ ok: true, data: todos });

  const findById = async (id: TodoId): Promise<Result<Todo | null, TodoRepositoryError>> => {
    const target = todos.find((t) => t.id === id);

    return {
      ok: true,
      data: target === undefined ? null : { ...target }
    };
  };

  const updateIsDone = async (id: TodoId, isDone: boolean): Promise<Result<Todo | null, TodoRepositoryError>> => {
    const target = todos.find((t) => t.id === id);

    if (target === undefined) return { ok: true, data: null };

    const updated = { ...target, isDone };
    todos = [...todos.filter((t) => t.id !== id), updated];

    return { ok: true, data: updated };
  };

  const deleteById = async (id: TodoId): Promise<Result<boolean, TodoRepositoryError>> => {
    if (!todos.some((t) => t.id === id)) return { ok: true, data: false };

    todos = todos.filter((t) => t.id !== id);
    return {
      ok: true,
      data: true
    };
  };

  const deleteManyByIds = async (ids: TodoId[]): Promise<Result<number, TodoRepositoryError>> => {
    let targetCount = 0;
    const idSet = new Set(ids);

    [todos, targetCount] = todos.reduce<[Todo[], number]>(
      (acc, cur) => (idSet.has(cur.id) ? [acc[0], acc[1] + 1] : [[...acc[0], cur], acc[1]]),
      [[], 0]
    );

    return {
      ok: true,
      data: targetCount
    };
  };

  return { create, findAll, findById, updateIsDone, deleteById, deleteManyByIds };
}

/**
 * 無条件に失敗する TODO Mock Repo を作成する
 * @returns Mock Repo
 */
export function createMockFailureTodoRepository(): TodoRepository {
  const create = async (_newTodo: InputTodo): Promise<Result<Todo, TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  const findAll = async (): Promise<Result<Todo[], TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  const findById = async (_id: TodoId): Promise<Result<Todo | null, TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  const updateIsDone = async (_id: TodoId, _isDone: boolean): Promise<Result<Todo | null, TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  const deleteById = async (_id: TodoId): Promise<Result<boolean, TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  const deleteManyByIds = async (_ids: TodoId[]): Promise<Result<number, TodoRepositoryError>> => ({
    ok: false,
    err: { type: 'database-error', cause: 0 as unknown }
  });

  return { create, findAll, findById, updateIsDone, deleteById, deleteManyByIds };
}
