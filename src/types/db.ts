import type { Todo } from './todo.js';

const dbLabelList = ['mock', 'storage'] as const; // 必要になったら DB を追加
export type DbLabel = (typeof dbLabelList)[number];

export type DbConfig = { label: 'mock'; initialData?: Todo[] } | { label: 'storage'; storage: Storage };

// export type DbFactoryMap = { [Key in DbLabel]: (config: Extract<DbConfig, { label: Key }>) => TodoDataBase };

export interface TodoDataBase {
  save(todos: Todo[]): Promise<void>;
  load(): Promise<Todo[]>;
}
