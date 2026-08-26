import type { TodoDataBase } from './types.js';
import { todoStore } from '../context/index.js';

export async function initTodoDB(db: TodoDataBase): Promise<void> {
  // 初回起動時に DB からデータをロード
  const initialData = await db.load();

  // ロードしたデータがあれば、Store に反映
  if (initialData.length > 0) todoStore.dispatch((s) => ({ ...s, todos: [...initialData] }));
}
