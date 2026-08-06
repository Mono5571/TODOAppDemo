import { createResult, resultifyValidator } from '../../libs/result.js';
import type { Result } from '../../types/result.js';
import { todoKeyList, type Todo, type TodoId, type TodoKey, type ValidDeadline } from '../../domain/Todo/types.js';
import { isValidDateNums, parseLocalDateNums } from '../../utils/dateStringValidator.js';
import { validatePriority } from '../../domain/Todo/validators/validatePriority.js';
import { validateTask } from '../../domain/Todo/validators/validateTask.js';
import type { MaybeTodo } from './types.js';
import { createErrors } from '../../domain/Todo/validators/validateInputValues.js';
import { cast } from '../../domain/Todo/validators/castBranded.js';

// フォーマットだけを検証
export function matchTodoIdFormat(maybeId: string): boolean {
  return /^(?!000000$)[0-9]{6}$/.test(maybeId);
}

// 重複を検証
export function createIsFirstOf(): (maybeId: string) => boolean {
  const usedIds = new Set<string>();

  return (maybeId: string): boolean => {
    if (usedIds.has(maybeId)) return false;
    usedIds.add(maybeId);
    return true;
  };
}

const isFirstOf = createIsFirstOf();

// フォーマットの検証をしたのち、クリアしたものだけ重複を検証
function validateMaybeId(maybeId: string): Result<TodoId, Error> {
  const { createSuccess, createFailure } = createResult<TodoId, Error>();

  if (!matchTodoIdFormat(maybeId)) return createFailure(new Error('invalid mock data: id is an incorrect format.'));

  if (!isFirstOf(maybeId)) return createFailure(new Error('invalid mock data: id is already used.'));

  return createSuccess(cast.todoId(maybeId));
}

export function validateMockDataSingular(
  mockData: MaybeTodo
): Result<Todo, { id: string; errors: Partial<Record<TodoKey, string>> }> {
  const { createSuccess, createFailure } = createResult<
    Todo,
    { id: string; errors: Partial<Record<TodoKey, string>> }
  >();

  // バリデーションのセクション
  const results = {
    id: validateMaybeId(mockData.id),
    task: validateTask(mockData.task),
    priority: validatePriority(mockData.priority),
    // 日付文字列として妥当か否かのみ検証、期限内かどうかは検証しない
    deadline: resultifyValidator<string, ValidDeadline, Error>((d: string): d is ValidDeadline => {
      const dNums = parseLocalDateNums(d);
      if (dNums === undefined) return false;
      return isValidDateNums(...dNums);
    }, new Error('invalid mock data: deadline is an incorrect format.'))(mockData.deadline),
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

  const errors: Partial<Record<TodoKey, string>> = createErrors<Todo, Error>(todoKeyList, results);

  return createFailure({ id: mockData.id, errors });
}

export function stringifyErrors(errors: Partial<Record<TodoKey, string>>): string {
  const errorKeyValues = Object.entries(errors);
  return errorKeyValues.length === 0
    ? 'unknown error occuerred.' // 本当はありえないが、型上は許容している
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
