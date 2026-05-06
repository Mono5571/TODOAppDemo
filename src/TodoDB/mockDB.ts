import type { Todo } from '../types/todo.js';
import type { DbConfig, TodoDataBase } from '../types/db.js';

export const createMockDB = (config: Extract<DbConfig, { label: 'mock' }>): TodoDataBase => {
  let memoryStorage: Todo[] = config.initialData ?? [];

  return {
    save: async (todos: Todo[]) => {
      // 参照を切るためにコピーして保存
      memoryStorage = [...todos];
      console.log('[MockDB] Saved:', memoryStorage);
    },

    load: async () => {
      console.log('[MockDB] Loaded:', memoryStorage);
      // 参照を渡さないようにコピーを返す
      return [...memoryStorage];
    }
  };
};
