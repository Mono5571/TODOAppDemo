import type { Todo } from '@todo/shared';

const dbLabelList = ['mock', 'storage'] as const; // 必要になったら 'api' を追加
export type DBLabel = (typeof dbLabelList)[number];

// discriminated union: label: DBLabel を discriminator として、分岐による絞り込みを可能にしたユニオン型
export type DBConfig =
  | { readonly label: 'mock'; readonly initialData?: Todo[] }
  | { readonly label: 'storage'; readonly storage: Storage };

// Mapped Types と FactoryMap Pattern を両立するための補助用の型
export type ConfigFor<L extends DBLabel> = Extract<DBConfig, { label: L }>;

export interface TodoDataBase {
  save(todos: Todo[]): Promise<void>;
  load(): Promise<Todo[]>;
}
