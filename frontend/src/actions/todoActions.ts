import type { FilterState, SortState, TodoState } from '../types/todoState.js';
import type { Todo, TodoId, TodoKey } from '@todo/shared';
import type { Store } from '../libs/createStore.js';
// import type { TodoDataBase } from '../TodoDB/types.js';
import type { RemoveAllMode } from '../types/uiState.js';
import { isExpiredDeadline } from '../services/isExpiredDeadline.js';
import type { TodoRepository } from '../repositories/todoRepository/types.js';
import type { InputTodo, UpdateTodo } from '../types/inputs.js';

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
 * todoRepository を経由:
 * - add: state.todos の末尾に Todo を追加する
 * - toggleDone: 指定した id の todo.isDone を書き換える
 * - remove: 指定した id の todo を state.todos から削除する
 * - removeAll: mode に従って done または expired の todo を削除する
 *
 * todoRepository を迂回:
 * - toggoleSort: state.sort の変更 -- type 書き換え、 type 同じなら order 逆に
 * - filterBy: state.filter を書き換える
 */
export function createTodoActions({
  todoStore,
  todoRepository
}: {
  todoStore: Store<TodoState>;
  todoRepository: TodoRepository;
}) {
  // 仮置き
  const handleError = (error: Error) => {
    console.error(error);
  };

  return {
    // todos の変更 -> todoRepository 経由
    add: async (input: InputTodo) => {
      const result = await todoRepository.create(input);
      if (!result.ok) {
        handleError(result.err);
        return;
      }
      todoStore.dispatch((s) => ({ ...s, todos: [...s.todos, result.data] }));
    },
    update: async (id: TodoId, input: UpdateTodo) => {
      const result = await todoRepository.update(id, input);
      if (!result.ok) {
        // renderError(result.err);
        console.error(result.err);
        return;
      }
      todoStore.dispatch((s) => ({ ...s, todos: s.todos.map((t) => (t.id === id ? { ...t, ...input } : t)) }));
    },
    remove: async (id: TodoId) => {
      const result = await todoRepository.delete(id);
      if (!result.ok) {
        handleError(result.err);
        return;
      }
      todoStore.dispatch((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) }));
    },
    removeAll: async (mode: RemoveAllMode) => {
      // .filter(t => <if() の条件>).map(t => t.id) と同じ
      const deleteIds = todoStore.state.todos.reduce<TodoId[]>((acc, todo) => {
        if ((mode.removeDone && todo.isDone) || (mode.removeExpired && isExpiredDeadline(todo.deadline))) {
          acc.push(todo.id);
        }
        return acc;
      }, []);

      if (deleteIds.length === 0) return;

      const result = await todoRepository.deleteAll(deleteIds);
      if (!result.ok) {
        handleError(result.err);
        return;
      }

      todoStore.dispatch((s) => ({ ...s, todos: result.data }));
    },

    // filter, sort の変更 -> そのまま dispatch
    toggleSort: (type: TodoKey) => todoStore.dispatch((s) => ({ ...s, sort: toggleSortHelper(s.sort, type) })),
    filterBy: (filter: FilterState) => todoStore.dispatch((s) => ({ ...s, filter }))
  } as const;
}
