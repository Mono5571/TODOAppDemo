import type { DbConfig, /*DbFactoryMap,*/ TodoDataBase } from '../types/db.js';
import { createMockDB } from './mockDB.js';
import { createStorageDB } from './storageDB.js';

/*
keyMap パターンを試みたが、config の型の絞り込みがうまくいかなかったので断念
export const dbFactory = {
  mock: createMockDB,
  storage: createStorageDB
} satisfies DbFactoryMap;
*/

export const createDB = (config: DbConfig): TodoDataBase => {
  // return dbFactory[config.label](config);
  switch (config.label) {
    case 'mock':
      return createMockDB(config);
    case 'storage':
      return createStorageDB(config);
    default:
      return config satisfies never; // satisfies never による網羅性チェック
  }
};
