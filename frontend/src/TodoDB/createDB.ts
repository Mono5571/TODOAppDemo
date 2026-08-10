import type { DBLabel, ConfigFor, TodoDataBase } from './types.js';
import { createMockDB } from './mockDB.js';
import { createStorageDB } from './storageDB.js';

export const DBFactory: { [L in DBLabel]: (config: ConfigFor<L>) => TodoDataBase } = {
  mock: createMockDB,
  storage: createStorageDB
  // api: createApiDB
};

export const createDB = <L extends DBLabel>(config: ConfigFor<L>): TodoDataBase => {
  return DBFactory[config.label](config);
};
