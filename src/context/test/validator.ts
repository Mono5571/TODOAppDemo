import { createResult } from '../../libs/createResult.js';
import type { Result } from '../../types/result.js';
import type { Priority, Todo, TodoId, TodoKey, ValidDeadline, ValidTask } from '../../domain/Todo/types.js';
import { isValidDateString } from '../../utils/dateStringValidator.js';
import { validatePriority } from '../../domain/Todo/validators/validatePriority.js';
import { validateTask } from '../../domain/Todo/validators/validateTask.js';
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

// { [k in TodoKey]: ErrorMessage } のオブジェクトを作る
// ただし Success のときはそのキーのプロパティ自体をもたない
function createErrors({
  idResult,
  taskResult,
  priorityResult,
  deadlineResult,
  isDoneResult
}: {
  idResult: Result<TodoId, Error>;
  taskResult: Result<ValidTask, Error>;
  priorityResult: Result<Priority, Error>;
  deadlineResult: Result<ValidDeadline, Error>;
  isDoneResult: Result<boolean, Error>;
}): Partial<Record<TodoKey, string>> {
  const errors: Partial<Record<TodoKey, string>> = {};
  if (!idResult.ok) errors.id = idResult.err.message;
  if (!taskResult.ok) errors.task = taskResult.err.message;
  if (!priorityResult.ok) errors.priority = priorityResult.err.message;
  if (!deadlineResult.ok) errors.deadline = deadlineResult.err.message;
  if (!isDoneResult.ok) errors.isDone = isDoneResult.err.message;

  return errors;
}

function validateMockDataSingular(
  mockData: MaybeTodo
): Result<Todo, { id: string; errors: Partial<Record<TodoKey, string>> }> {
  const { createSuccess, createFailure } = createResult<
    Todo,
    { id: string; errors: Partial<Record<TodoKey, string>> }
  >();

  // バリデーションのセクション
  const idResult = resultifyValidator<string, TodoId, Error>(
    isTodoIdString,
    new Error('invalid mock data: id is an incorrect format.')
  )(mockData.id);
  const taskResult = validateTask(mockData.task);
  const priorityResult = validatePriority(mockData.priority);
  // 日付文字列として妥当か否かのみ検証、期限内かどうかは検証しない
  const deadlineResult = resultifyValidator<string, ValidDeadline, Error>(
    (d: string): d is ValidDeadline => isValidDateString(d),
    new Error('invalid mock data: deadline is an incorrect format.')
  )(mockData.deadline);
  const isDoneResult = resultifyValidator<unknown, boolean, Error>(
    (x) => typeof x === 'boolean',
    new Error('invalid mock data: isDone must be boolean.')
  )(mockData.isDone);

  if (idResult.ok && taskResult.ok && priorityResult.ok && deadlineResult.ok && isDoneResult.ok) {
    return createSuccess({
      id: idResult.data,
      task: taskResult.data,
      priority: priorityResult.data,
      deadline: deadlineResult.data,
      isDone: isDoneResult.data
    });
  }

  const errors: Partial<Record<TodoKey, string>> = createErrors({
    idResult,
    taskResult,
    priorityResult,
    deadlineResult,
    isDoneResult
  });

  return createFailure({ id: mockData.id, errors });
}

function stringifyErrors(errors: Partial<Record<TodoKey, string>>): string {
  const errorKeyValues = Object.entries(errors);
  return errorKeyValues.length === 0
    ? 'unknown error occuerred.'
    : errorKeyValues.map(([key, value]) => `${key}: ${value}`).join(', ');
}

export function validateMockData(dataList: MaybeTodo[]): Todo[] {
  return dataList
    .map((data): undefined | Todo => {
      const result = validateMockDataSingular(data);
      if (!result.ok) {
        console.log(`ERROR on ${result.err.id}: ${stringifyErrors(result.err.errors)}`);
        return;
      }
      return result.data;
    })
    .filter((d) => d != null);
}
