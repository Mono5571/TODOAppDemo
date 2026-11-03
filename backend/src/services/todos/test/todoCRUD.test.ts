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
        deadline: '2026-10-08'
      });

      const result = await createTodo(testNoIdTodo, mockSuccessRepo);
      if (!result.ok) throw new Error('createTodo() の正常系テストケースでエラー');

      const findResult = await mockSuccessRepo.findAll();
      if (!findResult.ok) throw new Error('createTodo() の正常系でエラー: repo.findAll()');

      const expected = { ...testNoIdTodo, id: 0, isDone: false };
      t.assert.deepStrictEqual(result.data, expected);
      t.assert.deepStrictEqual(findResult.data, [expected]);
    });

    it('task が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: '', // 空文字列は不受理
        priority: 'high',
        deadline: '2026-10-08'
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('task が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-task');
    });

    it('priority が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'aaaaaa', // priority として不正な値
        deadline: '2026-10-08'
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('priority が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-priority');
    });

    it('deadline が不正 -> 検証エラー、書き込みなし', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'high',
        deadline: '20261008' // deadline は 'yyyy/mm/dd' 形式の有効かつ過去でない日付文字列
      });

      const result = await createTodo(testNoIdTodo, createMockSuccessTodoRepository([], createIdCounter()));

      if (result.ok) throw new Error('deadline が不正な値にもかかわらず、createTodo() が成功');

      t.assert.strictEqual(result.err.type, 'invalid-deadline');
    });

    it('DB エラー -> DB エラーを返す', async (t: TestContext) => {
      const testNoIdTodo = createTestNoIdTodo({
        task: 'a',
        priority: 'high',
        deadline: '2026-10-08'
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
          deadline: '2026-10-09'
        },
        {
          task: 'b',
          priority: 'middle',
          deadline: '2026-10-09'
        },
        {
          task: 'c',
          priority: 'middle',
          deadline: '2026-10-09'
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
        deadline: '2026-10-09'
      });

      const repo = createMockSuccessTodoRepository([testTodo], createIdCounter());

      it('正常系: TODO の更新が成功し、更新した TODO が返却される', async (t: TestContext) => {
        // 以下の 3 つが一致する
        // 1. 手元で isDone を変更したもの
        // 2. updateTodoIsDone() の戻り値
        // 3. DB 内の TODO (repo.findById() で取り出す)

        const result = await updateTodoIsDone({ id: targetId, isDone: expectedIsDone }, repo);
        if (!result.ok) throw new Error('正常系テストケースでエラー: updateTodoIsDone() が失敗');

        const findResult = await repo.findById(targetId);
        if (!findResult.ok) throw new Error('正常系テストケースでエラー: repo.findById() が失敗');
        const foundTodo = findResult.data;

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

  describe('deleteTodo() のテスト', () => {
    const targetId = createIdCounter().count();
    const testNoIdTodo = createTestNoIdTodo({
      task: 'a',
      priority: 'low',
      deadline: '2026-10-08'
    });

    const testIdCounter = createIdCounter();
    const repo = createMockSuccessTodoRepository([], testIdCounter);

    beforeEach(async () => {
      // Date をモックする
      mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });

      // mock repository 内にテスト用の TODO を保存しておく
      const result = await repo.create(testNoIdTodo);
      if (!result.ok) throw new Error('repo.create() が失敗');
    });
    afterEach(async () => {
      mock.timers.reset();
      testIdCounter.reset();
      // 保存された TODO をリセット
      const result = await repo.deleteById(targetId);
      if (!result.ok) throw new Error('repo.deleteById() が失敗');
    });

    it('正常系: 保存済のオブジェクトが削除され、true が data として返ってくる', async (t: TestContext) => {
      const result = await deleteTodo(targetId, repo);
      if (!result.ok) throw new Error('deleteTodo() のテスト: 正常系テストケースでエラー');

      t.assert.strictEqual(result.data, true);

      // TODO がきちんと削除されているか
      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('deleteTodo() のテスト内で repo.findAll() が失敗');

      t.assert.strictEqual(findResult.data.length, 0);
    });

    it('id が不正', async (t: TestContext) => {
      const result = await deleteTodo(parseInt('targetId'), repo);
      if (result.ok) throw new Error('deleteTodo() のテスト: 不正な id を受理');

      t.assert.strictEqual(result.err.type, 'invalid-todo-id');

      // TODO が削除されていないか
      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('deleteTodo() のテスト内で repo.findAll() が失敗');

      t.assert.strictEqual(findResult.data.length, 1);
    });

    it('指定した id の TODO が存在しない', async (t: TestContext) => {
      const result = await deleteTodo(targetId + 1, repo);
      if (result.ok) throw new Error('deleteTodo() のテスト: 存在しない TODO の削除に成功');

      t.assert.strictEqual(result.err.type, 'todo-not-found');

      // TODO が削除されていないか
      const findResult = await findTodos(repo);
      if (!findResult.ok) throw new Error('deleteTodo() のテスト内で findTodos() が失敗');

      t.assert.strictEqual(findResult.data.length, 1);
    });

    it('DB エラー -> DB エラーが返ってくる', async (t: TestContext) => {
      const result = await deleteTodo(targetId, mockFailureRepo);
      if (result.ok) throw new Error('deleteTodo() のテスト: 常に失敗する mock repo が成功');

      t.assert.strictEqual(result.err.type, 'persistence-error');

      // TODO が削除されていないか
      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('deleteTodo() のテスト内で repo.findAll() が失敗');

      t.assert.strictEqual(findResult.data.length, 1);
    });
  });

  describe('deleteTodosMany() のテスト', { todo: true }, () => {
    const targetIdCounter = createIdCounter();
    const targetIds = Array.from({ length: 3 }, (_) => targetIdCounter.count());
    const inputTodos = [
      {
        task: 'a',
        priority: 'low',
        deadline: '2026-10-08'
      },
      {
        task: 'b',
        priority: 'middle',
        deadline: '2026-10-09'
      },
      {
        task: 'c',
        priority: 'high',
        deadline: '2026-10-10'
      }
    ];
    const testNoIdTodos = inputTodos.map((t) => createTestNoIdTodo(t));

    const testIdCounter = createIdCounter();
    const repo = createMockSuccessTodoRepository([], testIdCounter);

    beforeEach(async () => {
      // Date をモック
      mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
      // テスト用の複数の TODO を保存しておく
      const results = await Promise.all(testNoIdTodos.map((t) => repo.create(t)));
      if (results.some((r) => !r.ok)) throw new Error('TODO の保存に失敗');
    });

    afterEach(async () => {
      mock.timers.reset();
      testIdCounter.reset();
      // 保存された TODO をリセット
      const result = await repo.deleteManyByIds(targetIds);
      if (!result.ok) throw new Error('TODO の削除に失敗');
    });

    it('正常系: 保存済みの複数の TODO を削除できる', async (t: TestContext) => {
      const result = await deleteTodosMany(targetIds, repo);
      if (!result.ok) throw new Error('正常系テストケースでエラー');

      t.assert.strictEqual(result.data, undefined);

      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('正常系テストケースで repo.findAll() が失敗');
      t.assert.strictEqual(findResult.data.length, 0);
    });

    it('ids に不正な値が含まれる', async (t: TestContext) => {
      const result = await deleteTodosMany([parseInt('a')], repo);
      if (result.ok) throw new Error('不正な値の ids で成功');
      t.assert.strictEqual(result.err.type, 'invalid-todo-id');

      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('repo.findAll() が失敗');
      t.assert.deepStrictEqual(
        findResult.data,
        testNoIdTodos.map((t, i) => ({ ...t, id: targetIds[i], isDone: false }))
      );
    });

    it('ひとつも TODO を削除できなかった', async (t: TestContext) => {
      const result = await deleteTodosMany([7], repo);
      if (result.ok) throw new Error('削除できないはずの TODO を削除できてしまった');
      t.assert.strictEqual(result.err.type, 'todo-not-found');

      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('repo.findAll() が失敗');
      t.assert.deepStrictEqual(
        findResult.data,
        testNoIdTodos.map((t, i) => ({ ...t, id: targetIds[i], isDone: false }))
      );
    });

    it('DB エラー -> DB エラーが返ってくる', async (t: TestContext) => {
      const result = await deleteTodosMany(targetIds, mockFailureRepo);
      if (result.ok) throw new Error('失敗すべきケースで成功');
      t.assert.strictEqual(result.err.type, 'persistence-error');

      const findResult = await repo.findAll();
      if (!findResult.ok) throw new Error('repo.findAll() が失敗');
      t.assert.deepStrictEqual(
        findResult.data,
        testNoIdTodos.map((t, i) => ({ ...t, id: targetIds[i], isDone: false }))
      );
    });
  });
});
