import type { Todo } from '../types/todo.js';
import { createDB } from '../TodoDB/createDB.js';
import { mockInitialData } from './test/test_mockDB.js';
import type { TodoState } from '../types/todoState.js';
import { createStore } from '../libs/createStore.js';
import type { FormState } from '../types/inputs.js';
import { createTodoActions } from '../actions/todoActions.js';
import { createFormActions } from '../actions/formActions.js';
import type { UIState } from '../types/uiState.js';
import { createUIActions } from '../actions/uiActions.js';

export const db = createDB({ label: 'mock', initialData: mockInitialData });

export const todoStore = createStore<TodoState>({ todos: [], sort: { type: 'id', order: 'ascend' }, filter: 'all' });

const initialInputValues = { task: '', priority: 'middle', deadline: '' };

export const formStore = createStore<FormState>({
  values: initialInputValues,
  touched: new Set(),
  hasAttemptedSubmit: false
});

export const uiStore = createStore<UIState>({
  removeAllMode: { removeDone: true, removeExpired: false },
  removeDialogOpen: false
});

export const todoActions = createTodoActions({ todoStore, db });
export const formActions = createFormActions({ formStore, initialInputValues });
export const uiActions = createUIActions(uiStore);
