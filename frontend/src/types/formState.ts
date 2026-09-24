import type { InputTodoKey, InputValues } from '@todo/shared';

export interface FormState {
  readonly values: InputValues;
  readonly touched: Set<InputTodoKey>;
  readonly hasAttemptedSubmit: boolean;
}
