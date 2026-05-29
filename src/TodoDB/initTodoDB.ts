import type { Todo } from '../types/todo.js';
import type { DBConfig, DBLabel, TodoDataBase } from '../types/db.js';
import { todoActions, todoStore } from '../TodoStore/index.js';

// initTodoDB: (db: TodoDataBase) => void
export const initTodoDB = async (db: TodoDataBase): Promise<void> => {
  // 1. 初回起動時に DB からデータをロードして Store に反映
  const initialData = await db.load();
  if (initialData.length > 0) todoActions.setInitial(initialData);

  // 2. Store の変更を監視して、変更があるたびに DB に保存
  todoStore.watch(
    // 全体の変更を監視
    (s) => s,
    (todos) => {
      db.save(todos);
    }
  );
};
