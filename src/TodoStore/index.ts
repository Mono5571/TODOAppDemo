import { createStore } from '../libs/createStore.js';
import type { TodoState } from '../types/state.js';

export const todoStore = createStore<TodoState>({ todos: [], sort: { type: 'id', order: 'ascend' }, filter: 'all' });
