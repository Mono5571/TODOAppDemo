import type { Todo } from '../domain/Todo/types.js';
import type { ConfigFor, TodoDataBase } from '../types/db.js';

export const createStorageDB = (config: ConfigFor<'storage'>): TodoDataBase => {
  const key = 'my-todo-app-v1';

  return {
    save: async (todos: Todo[]) => {
      try {
        config.storage.setItem(key, JSON.stringify(todos));
      } catch (e) {
        console.error('ストレージの保存に失敗しました。容量不足の可能性があります。', e);
      }
    },
    load: async () => {
      const data = config.storage.getItem(key);
      if (!data) return [];
      try {
        return JSON.parse(data) as Todo[]; // <- のちほどバリデーションを実装
      } catch {
        return [];
      }
    }
  };
};
