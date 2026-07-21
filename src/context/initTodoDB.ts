import type { TodoDataBase } from '../types/db.js';
import { generateTodoId } from '../utils/generateTodoId.js';
import type { Todo } from '../types/todo.js';
import { todoStore } from './index.js';

/**
 * ロードしたデータがあれば、id 順に並べなおして新しい id を振る
 *
 * 本来必要ない処理
 * @param data DB.looad() で読み込んだ Todo[]
 * @returns 新しく id を振りなおした Todo[]
 */
function sortLoadedData(data: Todo[]): Todo[] {
  if (data.length === 0) return data;
  return data
    .toSorted((a, b) => parseInt(a.id, 10) - (b.id, 10))
    .map((todo): Todo | null => {
      const result = generateTodoId();
      if (!result.isSuccess) return null;
      return { ...todo, id: result.data };
    })
    .filter((t): t is NonNullable<Todo> => t != null);
}

export async function initTodoDB(db: TodoDataBase): Promise<void> {
  // 初回起動時に DB からデータをロード
  const loadedData = await db.load();

  const initialData = sortLoadedData(loadedData);

  // ロードしたデータがあれば、Store に反映
  if (initialData.length > 0) todoStore.dispatch((s) => ({ ...s, todos: [...initialData] }));
}
