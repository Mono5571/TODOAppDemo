import { beforeEach, afterEach, mock, describe, it, type TestContext } from 'node:test';
import {
  createIdCounter,
  createMockSuccessTodoRepository,
  createMockFailureTodoRepository
} from '../../../repositories/todo/mockTodoRepository.ts';
import type { Todo } from '@todo/shared';
import { createTodo } from '../createTodo.ts';
import { findTodos } from '../findTodos.ts';
import { updateTodoIsDone } from '../updateTodoIsDone.ts';
import { deleteTodo } from '../deleteTodo.ts';
import { deleteTodosMany } from '../deleteTodosMany.ts';

type PreNoIdTodo = {
  task: string;
  priority: 'low' | 'middle' | 'high';
  deadline: string;
  isDone: boolean;
};

function createTestNoIdTodo(preNoIdTodo: PreNoIdTodo): Omit<Todo, 'id'> {
  return preNoIdTodo as Omit<Todo, 'id'>;
}

const mockFailureRepo = createMockFailureTodoRepository();

describe('Todo Service --ビジネスロジックに基づく入力値検証と、DB の読み書き処理-- の検証', { todo: true }, () => {
  describe('createTodo() のテスト', () => {
    // Date をモックする
    beforeEach(() => {
      mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
    });
    afterEach(() => {
      mock.timers.reset();
    });

    it('正常系 -> オブジェクトが保存され、返ってくる', async (t: TestContext) => {
      const mockSuccessRepo = createMockSuccessTodoRepository([], createIdCounter());

      const testNoIdTodo = createTestNoIdTodo({
        task: 'createTodo() をテストする',
        priority: 'high',
        deadline: '2026-10-08',
        isDone: false
      });

      const result = await createTodo(testNoIdTodo, mockSuccessRepo);
      if (!result.ok) throw new Error('createTodo() の正常系テストケースでエラー');

      const findResult = await mockSuccessRepo.findAll();
      if (!findResult.ok) throw new Error('createTodo() の正常系でエラー: repo.findAll()');

      const expected = { ...testNoIdTodo, id: 0 };
      t.assert.deepStrictEqual(result.data, expected);
      t.assert.deepStrictEqual(findResult.data, [expected]);
    });

    it('task が不正 -> 検証エラー、書き込みなし', { todo: true });

    it('priority が不正 -> 検証エラー、書き込みなし', { todo: true });

    it('deadline が不正 -> 検証エラー、書き込みなし', { todo: true });

    it('DB エラー -> DB エラーを返す', { todo: true });
  });

  describe('findTodos() のテスト', { todo: true });

  describe('updateTodoIsDone() のテスト', { todo: true });

  describe('deleteTodo() のテスト', { todo: true });

  describe('deleteTodosMany() のテスト', { todo: true });
});
