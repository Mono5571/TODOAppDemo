import { createResult } from '../../libs/createResult.js';
import type { Result } from '../../types/result.js';
import { todoKeyList, type Todo, type TodoId, type TodoKey, type ValidDeadline } from '../../domain/Todo/types.js';
import { isValidDateString } from '../../utils/dateStringValidator.js';
import { validatePriority } from '../../domain/Todo/validators/validatePriority.js';
import { validateTask } from '../../domain/Todo/validators/validateTask.js';
import type { MaybeTodo } from './types.js';
import { createErrors } from '../../domain/Todo/validators/validateInputValues.js';

/** Type Predicator を受け取り、Result 型を返す関数に加工するデコレータ */
function resultifyValidator<T, D extends T, E>(validator: (arg: T) => arg is D, error: E): (arg: T) => Result<D, E> {
  const { createSuccess, createFailure } = createResult<D, E>();
  return (arg: T) => (validator(arg) ? createSuccess(arg) : createFailure(error));
}

// 考慮事項: 重複を除外できていない
function isTodoIdString(maybeId: string): maybeId is TodoId {
  return /^(?!000000$)[0-9]{6}$/.test(maybeId);
}

function validateMockDataSingular(
  mockData: MaybeTodo
): Result<Todo, { id: string; errors: Partial<Record<TodoKey, string>> }> {
  const { createSuccess, createFailure } = createResult<
    Todo,
    { id: string; errors: Partial<Record<TodoKey, string>> }
  >();

  // バリデーションのセクション
  const results = {
    id: resultifyValidator<string, TodoId, Error>(
      isTodoIdString,
      new Error('invalid mock data: id is an incorrect format.')
    )(mockData.id),
    task: validateTask(mockData.task),
    priority: validatePriority(mockData.priority),
    // 日付文字列として妥当か否かのみ検証、期限内かどうかは検証しない
    deadline: resultifyValidator<string, ValidDeadline, Error>(
      (d: string): d is ValidDeadline => isValidDateString(d),
      new Error('invalid mock data: deadline is an incorrect format.')
    )(mockData.deadline),
    isDone: resultifyValidator<unknown, boolean, Error>(
      (x) => typeof x === 'boolean',
      new Error('invalid mock data: isDone must be boolean.')
    )(mockData.isDone)
  };

  if (results.id.ok && results.task.ok && results.priority.ok && results.deadline.ok && results.isDone.ok) {
    return createSuccess({
      id: results.id.data,
      task: results.task.data,
      priority: results.priority.data,
      deadline: results.deadline.data,
      isDone: results.isDone.data
    });
  }

  const errors: Partial<Record<TodoKey, string>> = createErrors(todoKeyList, results);

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
