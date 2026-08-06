import type { ValidTask, Priority, ValidDeadline } from '../domain/Todo/types.js';

export const inputKeyList = ['task', 'priority', 'deadline'] as const;
export type InputKey = (typeof inputKeyList)[number];

export type InputValues = { [key in InputKey]: string };

export interface BaseValidInputValues {
  task: ValidTask;
  priority: Priority;
  deadline: ValidDeadline;
}

export type ValidInputs = Pick<Readonly<BaseValidInputValues>, InputKey>;

const _inputsCheck = {} as InputKey satisfies keyof BaseValidInputValues; // inputsKeyList にミスがあればコンパイルエラー

export interface FormState {
  readonly values: InputValues;
  readonly touched: Set<InputKey>;
  readonly hasAttemptedSubmit: boolean;
}
