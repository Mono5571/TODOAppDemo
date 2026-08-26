import type { Store } from '../libs/createStore.js';
import type { FormState } from '../types/formState.js';
import type { InputValues } from '@todo/shared';

export function createFormActions({
  formStore,
  initialInputValues
}: {
  formStore: Store<FormState>;
  initialInputValues: InputValues;
}) {
  return {
    update: (key: keyof InputValues, value: string) =>
      formStore.dispatch((s) => ({
        ...s,
        values: { ...s.values, [key]: value },
        touched: new Set(s.touched).add(key)
      })),
    setAttemptedSubmit: () => formStore.dispatch((s) => ({ ...s, hasAttemptedSubmit: true })),
    reset: () =>
      formStore.dispatch((_) => ({
        values: initialInputValues,
        touched: new Set(),
        hasAttemptedSubmit: false
      }))
  } as const;
}
