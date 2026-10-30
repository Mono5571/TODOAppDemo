import { before, after, beforeEach, afterEach, mock, describe, it, type TestContext } from 'node:test';
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
  priority: string;
  deadline: string;
  isDone: boolean;
};

function createTestNoIdTodo(preNoIdTodo: PreNoIdTodo): Omit<Todo, 'id'> {
  return preNoIdTodo as Omit<Todo, 'id'>;
}

const mockFailureRepo = createMockFailureTodoRepository();

describe('Todo Service --ビジネスロジックに基づく入力値検証と、DB の読み書き処理-- の検証', () => {
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

    it('task が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: '', // 空文字列は不受理
        priority: 'high',
        deadline: '2026-10-08',
        isDone: false
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('task が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-task');
    });

    it('priority が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'aaaaaa', // priority として不正な値
        deadline: '2026-10-08',
        isDone: false
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('priority が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-priority');
    });

    it('deadline が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'high',
        deadline: '20261008', // deadline は 'yyyy/mm/dd' 形式の有効かつ過去でない日付文字列
        isDone: false
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('deadline が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-deadline');
    });

    it('DB エラー -> DB エラーを返す', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'high',
        deadline: '2026-10-08',
        isDone: false
      });

      const result = await createTodo(testNoIdTodo, mockFailureRepo);

      if (result.ok) throw new Error('DB エラーを返すべきテストケースで成功');

      t.assert.strictEqual(result.err.type, 'persistence-error');
    });
  });

  describe('findTodos() のテスト', () => {
    it('正常系: 保存された TODO がすべて返ってくる', async (t: TestContext) => {
      // Date をモックする
      before(() => {
        mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
      });
      after(() => {
        mock.timers.reset();
      });

      const testTodos: Omit<Todo, 'id'>[] = [
        {
          task: 'a',
          priority: 'middle',
          deadline: '2026-10-09',
          isDone: false
        },
        {
          task: 'b',
          priority: 'middle',
          deadline: '2026-10-09',
          isDone: false
        },
        {
          task: 'c',
          priority: 'middle',
          deadline: '2026-10-09',
          isDone: false
        }
      ].map((p) => createTestNoIdTodo(p));

      const counter = createIdCounter();
      const savedTodos: Todo[] = testTodos.map((t) => ({ ...t, id: counter.count() }));

      const repo = createMockSuccessTodoRepository(testTodos, createIdCounter());

      const result = await findTodos(repo);
      if (!result.ok) throw new Error('findTodo() のテスト: 正常系テストケースでエラー');

      t.assert.deepStrictEqual(result.data, savedTodos);
    });

    it('異常系: DB エラーが返ってくる', async (t: TestContext) => {
      const repo = createMockFailureTodoRepository();

      const result = await findTodos(repo);
      if (result.ok) throw new Error('findTodos() のテスト: 異常系テストケースが成功');

      t.assert.strictEqual(result.err.type, 'persistence-error');
    });
  });

  describe('updateTodoIsDone() のテスト', () => {
    describe('正常系と指定した id の TODO が見つからないケース', () => {
      // Date をモックする
      before(() => {
        mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
      });
      after(() => {
        mock.timers.reset();
      });

      const expectedIsDone = true;
      const targetId = createIdCounter().count();

      const testTodo = createTestNoIdTodo({
        task: 'test',
        priority: 'middle',
        deadline: '2026-10-09',
        isDone: !expectedIsDone
      });

      const repo = createMockSuccessTodoRepository([testTodo], createIdCounter());

      it('正常系: TODO の更新が成功し、更新した TODO が返却される', async (t: TestContext) => {
        // 以下の 3 つが一致する
        // 1. 手元で isDone を変更したもの
        // 2. updateTodoIsDone() の戻り値
        // 3. DB 内の TODO (findTodos() で取り出す)

        const result = await updateTodoIsDone({ id: targetId, isDone: expectedIsDone }, repo);
        if (!result.ok) throw new Error('正常系テストケースでエラー: updateTodoIsDone() が失敗');

        const findResult = await findTodos(repo);
        if (!findResult.ok) throw new Error('正常系テストケースでエラー: findTodos() が失敗');
        const foundTodo = findResult.data.find((t) => t.id === targetId);

        if (foundTodo === undefined)
          throw new Error('正常系テストケースでエラー: findTodos() で対象の TODO が見つからなかった');

        const expectedTodo: Todo = { ...testTodo, id: targetId, isDone: expectedIsDone };
        const updatedTodo = result.data;

        t.assert.deepStrictEqual(foundTodo, expectedTodo);
        t.assert.deepStrictEqual(foundTodo, updatedTodo);
      });

      it('指定した id の TODO が見つからない -> リポジトリエラー', async (t: TestContext) => {
        const result = await updateTodoIsDone({ id: targetId + 1, isDone: true }, repo);

        t.assert.deepStrictEqual(result, {
          ok: false,
          err: { type: 'todo-not-found' }
        });
      });
    });

    it('id の形式が不正 -> 検証エラー、更新しない', async (t: TestContext) => {
      const repo = createMockSuccessTodoRepository([], createIdCounter());

      // id として NaN を指定
      const result = await updateTodoIsDone({ id: parseInt('a'), isDone: true }, repo);

      t.assert.deepStrictEqual(result, {
        ok: false,
        err: { type: 'invalid-todo-id' }
      });
    });

    it('isDone が不正 -> 検証エラー、更新しない', async (t: TestContext) => {
      const repo = createMockSuccessTodoRepository([], createIdCounter());

      // isDone として不正な値を指定
      const result = await updateTodoIsDone({ id: 0, isDone: 'true' as unknown as boolean }, repo);

      t.assert.deepStrictEqual(result, {
        ok: false,
        err: { type: 'invalid-is-done' }
      });
    });

    it('DB エラー -> DB エラーが返ってくる', async (t: TestContext) => {
      const repo = createMockFailureTodoRepository();
      const result = await updateTodoIsDone({ id: 0, isDone: true }, repo);

      t.assert.deepStrictEqual(result, {
        ok: false,
        err: { type: 'persistence-error' }
      });
    });
  });

  describe('deleteTodo() のテスト', { todo: true });

  describe('deleteTodosMany() のテスト', { todo: true });
});
