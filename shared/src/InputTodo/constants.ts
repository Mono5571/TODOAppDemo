import type { InputTodoKey } from './types.js';

export const inputKeyList = ['task', 'priority', 'deadline'] as const satisfies Permutation<InputTodoKey>;

type Permutation<T, K = T> = [T] extends [never] ? [] : K extends K ? [K, ...Permutation<Exclude<T, K>>] : never;
