import { createResult } from '../../libs/createResult.js';
import type { Result } from '../../types/result.js';
import type { Todo, TodoId, TodoKey, ValidDeadline } from '../../types/todo.js';
import { isValidDateString } from '../../utils/dateStringValidator.js';
import { validatePriority } from '../../validators/validatePriority.js';
import { validateTask } from '../../validators/validateTask.js';
import type { MaybeTodo } from './types.js';

/** Type Predicator を受け取り、Result 型を返す関数に加工するデコレータ */
function resultifyValidator<T, D extends T, E>(validator: (arg: T) => arg is D, error: E): (arg: T) => Result<D, E> {
  const { createSuccess, createFailure } = createResult<D, E>();
  return (arg: T) => (validator(arg) ? createSuccess(arg) : createFailure(error));
}

// 考慮事項: 重複を除外できていない
function isTodoIdString(maybeId: string): maybeId is TodoId {
  return /^(?!000000$)[0-9]{6}$/.test(maybeId);
}

function validateMockDataSingle(mockData: MaybeTodo): Result<Todo, Partial<Record<TodoKey, string>>> {
  const { createSuccess, createFailure } = createResult<Todo, Partial<Record<TodoKey, string>>>();

  const idResult = resultifyValidator<string, TodoId, Error>(
    isTodoIdString,
    new Error('invalid mock data: id is an incorrect format.')
  )(mockData.id);
  const taskResult = validateTask(mockData.task);
  const priorityResult = validatePriority(mockData.priority);
  const deadlineResult = resultifyValidator<string, ValidDeadline, Error>(
    isValidDateString,
    new Error('invalid mock data: deadline is an incorrect format.')
  )(mockData.deadline);
  const isDoneResult = resultifyValidator<unknown, boolean, Error>(
    (x) => typeof x === 'boolean',
    new Error('invalid mock data: isDone must be boolean.')
  )(mockData.isDone);

  if (
    idResult.isSuccess &&
    taskResult.isSuccess &&
    priorityResult.isSuccess &&
    deadlineResult.isSuccess &&
    isDoneResult.isSuccess
  ) {
    return createSuccess({
      id: idResult.data,
      task: taskResult.data,
      priority: priorityResult.data,
      deadline: deadlineResult.data,
      isDone: isDoneResult.data
    });
  }

  let errors: Partial<Record<TodoKey, string>> = {};
  if (!idResult.isSuccess) errors = { ...errors, id: idResult.error.message };
  if (!taskResult.isSuccess) errors = { ...errors, task: taskResult.error.message };
  if (!priorityResult.isSuccess) errors = { ...errors, priority: priorityResult.error.message };
  if (!deadlineResult.isSuccess) errors = { ...errors, deadline: deadlineResult.error.message };
  if (!isDoneResult.isSuccess) errors = { ...errors, isDone: isDoneResult.error.message };

  return createFailure(errors);
}

export function validateMockData(dataList: MaybeTodo[]): Todo[] {
  return dataList
    .map((data): undefined | Todo => {
      const result = validateMockDataSingle(data);
      if (!result.isSuccess) {
        console.log(result.error);
        return;
      }
      return result.data;
    })
    .filter((d) => d != null);
}
