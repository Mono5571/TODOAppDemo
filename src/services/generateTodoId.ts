import { createResult } from '../libs/result.js';
import type { Result } from '../types/result.js';
import { type TodoId, TODO_ID_COUNT_MAX } from '../domain/Todo/types.js';
import { cast } from '../domain/Todo/validators/castBranded.js';

/**
 * '000001' から '999999' までのゼロ埋め 6 ケタの連番の文字列を TodoId として生成し、Result 型に包んで返す関数
 *
 * - IIFE で生成される変数 count のクロージャ
 */
export const generateTodoId = (() => {
  let count: number = 0;
  return (): Result<TodoId, Error> => {
    // generateTodoId() がよばれたら count のインクリメント
    count = count + 1;

    // Result 型への準備
    const { createSuccess, createFailure } = createResult<TodoId, Error>();

    if (count >= TODO_ID_COUNT_MAX + 1) return createFailure(new Error('タスクの登録数が上限に達しています。'));

    if (count >= 1 && count <= TODO_ID_COUNT_MAX) return createSuccess(cast.todoId(count.toString().padStart(6, '0')));

    return createFailure(new Error('unexpeted error occurred on generateTodoId()'));
  };
})();
