import type { Result, Todo, TodoId } from '@todo/shared';
import type { InputTodo, UpdateTodo } from '../../types/inputs';

export interface TodoRepository {
  findAll: () => Promise<Result<readonly Todo[], Error>>;
  create: (input: InputTodo) => Promise<Result<Todo, Error>>;
  update: (id: TodoId, input: UpdateTodo) => Promise<Result<void, Error>>;

  // ひとつずつリクエストを送って削除するのはパフォーマンスの問題がある
  // TodoId[] を引数にとり、一括削除できるように改善する
  remove: (id: TodoId) => Promise<Result<void, Error>>;
  removeAll: (ids: TodoId[]) => Promise<Result<readonly Todo[], Error>>;
}
