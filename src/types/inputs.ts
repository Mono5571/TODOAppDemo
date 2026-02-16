import type { ValidTask, Priority, ValidDeadline } from './todo.js';

export const inputKeyList = ['task', 'priority', 'deadline'] as const;
export type InputKey = (typeof inputKeyList)[number];

export type InputValues = { [key in InputKey]: string };

export interface BaseValidInputValues {
  task: ValidTask;
  priority: Priority;
  deadline: ValidDeadline;
}

export type ValidInputs = Pick<BaseValidInputValues, InputKey>;

const _inputsCheck = {} as InputKey satisfies keyof BaseValidInputValues; // inputsKeyList にミスがあればコンパイルエラー

export type FormState = {
  values: InputValues;
  touched: Set<InputKey>;
  hasAttemptedSubmit: boolean;
};
