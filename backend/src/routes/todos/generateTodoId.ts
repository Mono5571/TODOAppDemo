// このファイルはあとで消す
import { TODO_ID_COUNT_MAX } from '@todo/shared';
import type { TodoId, Result } from '@todo/shared';

export const generateTodoId = (() => {
  let count: number = 0;
  return (): Result<TodoId, Error> => {
    // generateTodoId() がよばれたら count のインクリメント
    count = count + 1;

    if (count >= TODO_ID_COUNT_MAX + 1) return { ok: false, err: new Error('タスクの登録数が上限に達しています。') };

    if (count >= 1 && count <= TODO_ID_COUNT_MAX)
      return { ok: true, data: count.toString().padStart(6, '0') as TodoId };

    return { ok: false, err: new Error('unexpeted error occurred on generateTodoId()') };
  };
})();
