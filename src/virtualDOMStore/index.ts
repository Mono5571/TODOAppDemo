import { createStore } from '../libs/createStore.js';
import type { Todo } from '../types/todo.js';

export type VirtualDOM = Todo & { readonly viewId: number };

const virtualDOMStore = createStore<VirtualDOM[]>([]);
