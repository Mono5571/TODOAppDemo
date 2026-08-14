import type { Todo } from '@todo/shared';
import type { ConfigFor, TodoDataBase } from './types.js';

export const createMockDB = (config: ConfigFor<'mock'>): TodoDataBase => {
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
