import type { InputValues, FormState } from '../types/inputs.js';
import { createStore } from '../libs/createStore.js';

const initialInputValues = { task: '', priority: 'middle', deadline: '' };

export const formStore = createStore<FormState>({
  values: initialInputValues,
  touched: new Set(),
  hasAttemptedSubmit: false
});

export const formActions = {
  update: (key: keyof InputValues, value: string) =>
    formStore.dispatch((s) => ({ ...s, values: { ...s.values, [key]: value }, touched: new Set(s.touched).add(key) })),
  setAttemptedSubmit: () => formStore.dispatch((s) => ({ ...s, hasAttemptedSubmit: true })),
  reset: () =>
    formStore.dispatch((_) => ({
      values: initialInputValues,
      touched: new Set(),
      hasAttemptedSubmit: false
    }))
};
