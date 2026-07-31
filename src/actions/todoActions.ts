import type { FilterState, SortState, TodoState } from '../types/todoState.js';
import type { Todo, TodoKey } from '../domain/Todo/types.js';
import type { Store } from '../libs/createStore.js';
import type { TodoDataBase } from '../TodoDB/types.js';
import type { RemoveAllMode } from '../types/uiState.js';
import { isFutureOrToday } from '../utils/dateStringValidator.js';

function createTodoTransaction({ todoStore, db }: { todoStore: Store<TodoState>; db: TodoDataBase }) {
  return async (updater: (todos: Todo[]) => Todo[]) => {
    const current = todoStore.state;
    const next: TodoState = {
      ...current,
      todos: updater(current.todos)
    };

    try {
      await db.save(next.todos); // throwable

      todoStore.dispatch(() => next);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
      console.error('unknow error occured.');
    }
  };
}

/**
 * toggleSort の補助関数
 *
 * - sort タイプが同じなら昇順 / 降順の切り替え
 * - sort タイプが異なるなら、タイプを切り替えて昇順に
 */
function toggleSortHelper(current: SortState, type: TodoKey): SortState {
  if (current.type === type) return { type, order: current.order === 'ascend' ? 'descend' : 'ascend' };
  return { type, order: 'ascend' };
}

/**
 * todoStore の dispatch 処理をまとめたオブジェクト
 *
 * db.save() を経由:
 * - add: state.todos の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state.todos から削除する
 * - removeAll: mode に従って done または expired の todo を削除する
 *
 * db.save() を迂回:
 * - toggoleSort: state.sort の変更 -- type 書き換え、 type 同じなら order 逆に
 * - filterBy: state.filter を書き換える
 */
export function createTodoActions({ todoStore, db }: { todoStore: Store<TodoState>; db: TodoDataBase }) {
  const transaction = createTodoTransaction({ todoStore, db });
  return {
    // todos の変更 -> transaction (db.save()) 経由
    add: (todo: Todo) => transaction((todos) => [...todos, todo]),
    toggleDone: (id: string) =>
      transaction((todos) => todos.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))),
    remove: (id: string) => transaction((todos) => todos.filter((t) => t.id !== id)),
    removeAll: (mode: RemoveAllMode) =>
      transaction((todos) =>
        todos.filter(
          (t) =>
            !(mode.removeDone && t.isDone) &&
            !(mode.removeExpired && /* isExpired(t.deadline) */ !isFutureOrToday(t.deadline))
        )
      ),
    // filter, sort の変更 -> そのまま dispatch
    toggleSort: (type: TodoKey) => todoStore.dispatch((s) => ({ ...s, sort: toggleSortHelper(s.sort, type) })),
    filterBy: (filter: FilterState) => todoStore.dispatch((s) => ({ ...s, filter }))
  } as const;
}
