import type { InputKey, InputValues } from './inputs';

export interface FormState {
  readonly values: InputValues;
  readonly touched: Set<InputKey>;
  readonly hasAttemptedSubmit: boolean;
}
