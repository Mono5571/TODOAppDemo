import { afterEach, beforeEach, describe, it, mock, type TestContext } from 'node:test';
import { matchTodoIdFormat, createIsFirstOf, validateMockDataSingular } from '../context/mock/validator.js';
import type { MaybeTodo } from '../context/mock/types.js';
import { TASK_MAX_LENGTH, type TodoKey } from '../domain/Todo/types.js';
import type { Failure } from '../types/result.js';

describe('matchTodoIdFormat() のテスト', () => {
  it('フォーマットに沿っているなら成功', (t: TestContext) => {
    const id1 = '000001';
    const id2 = '123456';
    const id3 = '999999';
    const id4 = '000001'; // 重複は見ない

    t.assert.strictEqual(matchTodoIdFormat(id1), true);
    t.assert.strictEqual(matchTodoIdFormat(id2), true);
    t.assert.strictEqual(matchTodoIdFormat(id3), true);
    t.assert.strictEqual(matchTodoIdFormat(id4), true);
  });

  it('フォーマットに沿っていないなら失敗', (t: TestContext) => {
    const notIds = [
      '',
      '000000',
      '1000000',
      '1a2345',
      'abcdef',
      '123 456',
      '1\n23456',
      '12345',
      '１２３４５６',
      '123.45',
      '-12345',
      '+12345',
      '0x1234'
    ];

    notIds.forEach((notId) => {
      t.assert.strictEqual(matchTodoIdFormat(notId), false);
    });
  });
});

describe('isFirstOf() のテスト', () => {
  const isFirstOf = createIsFirstOf();
  const cases: string[] = ['', 'aaa', '\n', '000101', ' 123456 '];

  it('どんな文字列でも最初の入力なら成功', (t: TestContext) => {
    cases.forEach((c) => t.assert.strictEqual(isFirstOf(c), true));
  });

  it('2 回目の入力なら失敗', (t: TestContext) => {
    cases.forEach((c) => t.assert.strictEqual(isFirstOf(c), false));
  });

  const isFirstOf_2 = createIsFirstOf();
  it('isFirstOf() 自体の参照が変わればリセット', (t: TestContext) => {
    cases.forEach((c) => t.assert.strictEqual(isFirstOf_2(c), true));
    cases.forEach((c) => t.assert.strictEqual(isFirstOf_2(c), false));
  });
});

describe('validateMockDataSingular() のテスト', () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
  });
  afterEach(() => {
    mock.timers.reset();
  });

  it('成功：期日を過ぎたかは問わない', (t: TestContext) => {
    const todo_1: MaybeTodo = {
      id: '123456',
      task: 'abcdefg',
      priority: 'high',
      deadline: '2100-01-01',
      isDone: false
    };

    const todo_2: MaybeTodo = {
      id: '000001',
      task: '123456',
      priority: 'middle',
      deadline: '2026-08-03', // 期日を過ぎたかは問わない
      isDone: true
    };

    t.assert.deepStrictEqual(validateMockDataSingular(todo_1), {
      ok: true,
      data: todo_1
    });
    t.assert.deepStrictEqual(validateMockDataSingular(todo_2), {
      ok: true,
      data: todo_2
    });
  });

  it('失敗：期日を過ぎたかは問わない', (t: TestContext) => {
    const notTodo_1: MaybeTodo = {
      id: '000001',
      task: '',
      priority: '',
      deadline: '',
      isDone: true
    };

    t.assert.deepStrictEqual(validateMockDataSingular(notTodo_1), {
      ok: false,
      err: {
        id: notTodo_1.id,
        errors: {
          id: 'invalid mock data: id is already used.',
          task: 'タイトルを入力してください',
          priority: '「低」「並」「高」のうちいずれかを選んでください',
          deadline: 'invalid mock data: deadline is an incorrect format.'
        }
      }
    } satisfies Failure<{ id: string; errors: Partial<Record<TodoKey, string>> }>);

    const notTodo_2: MaybeTodo = {
      id: '',
      task: Array.from({ length: TASK_MAX_LENGTH + 1 }, () => 'a').join(''),
      priority: 'very high',
      deadline: '2026-08-04',
      isDone: false
    };

    t.assert.deepStrictEqual(validateMockDataSingular(notTodo_2), {
      ok: false,
      err: {
        id: notTodo_2.id,
        errors: {
          id: 'invalid mock data: id is an incorrect format.',
          task: `${TASK_MAX_LENGTH} 文字以内で入力してください`,
          priority: '「低」「並」「高」のうちいずれかを選んでください'
        }
      }
    } satisfies Failure<{ id: string; errors: Partial<Record<TodoKey, string>> }>);
  });
});
