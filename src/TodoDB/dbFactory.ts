import type { DbConfig, /*DbFactoryMap,*/ TodoDataBase } from '../types/db.js';
import { createMockDBManager } from './mockDB.js';
import { createStorageDBManager } from './storageDB.js';

/*
export const dbFactory = {
  mock: createMockDBManager,
  storage: createStorageDBManager
} satisfies DbFactoryMap;
*/

export const createDB = (config: DbConfig): TodoDataBase => {
  // return dbFactory[config.label](config);
  switch (config.label) {
    case 'mock':
      return createMockDBManager(config);
    case 'storage':
      return createStorageDBManager(config);
    default:
      return config satisfies never;
  }
};
