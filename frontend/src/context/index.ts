import type { TodoState } from '../types/todoState.js';
import { createStore } from '../libs/createStore.js';
import type { FormState } from '../types/formState.js';
import { createTodoActions } from '../actions/todoActions.js';
import { createFormActions } from '../actions/formActions.js';
import type { UIState } from '../types/uiState.js';
import { createUIActions } from '../actions/uiActions.js';
import { createTodoRepository } from '../repositories/todoRepository/createTodoRepository.js';
import { createApiClient } from '../api/createApiClient.js';
import { env } from '../config/env.js';

export const todoRepository = createTodoRepository(
  createApiClient({ apiBaseUrl: env.apiBaseUrl, fetchClient: (...args) => window.fetch(...args) })
);

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

export const todoActions = createTodoActions({ todoStore, todoRepository });
export const formActions = createFormActions({ formStore, initialInputValues });
export const uiActions = createUIActions(uiStore);
