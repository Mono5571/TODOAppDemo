import { afterEach, beforeEach, describe, it, mock, type TestContext } from 'node:test';
import { computeViewTodos, isCloseToDeadline, todosComparerMap } from '../components/TodoTable/computeViewTodos.js';
import type { FilterState, SortState, TodoState } from '../types/todoState.js';
import type { MaybeTodo } from '../context/mock/types.js';
import type { Todo, ValidDeadline } from '../domain/Todo/types.js';

function createTestTodo(todo: MaybeTodo): Todo {
  return todo as Todo;
}

function createTestTodoState(todos: MaybeTodo[], sort: SortState, filter: FilterState): TodoState {
  return { todos: todos as Todo[], sort, filter };
}

const todo_1 = createTestTodo({
  id: '000001',
  task: 'evergreen planting',
  priority: 'middle',
  deadline: '2028-12-01',
  isDone: true
});

const todo_2 = createTestTodo({
  id: '000002',
  task: 'chase own shadow',
  priority: 'low',
  deadline: '2027-08-11',
  isDone: true
});

const todo_3 = createTestTodo({
  id: '000003',
  task: 'acknowledge a handshake',
  priority: 'high',
  deadline: '2027-11-07',
  isDone: true
});

const todo_4 = createTestTodo({
  id: '000004',
  task: 'fly like a bird',
  priority: 'high',
  deadline: '2030-01-03',
  isDone: false
});

const todo_5 = createTestTodo({
  id: '000005',
  task: 'dig through the time',
  priority: 'middle',
  deadline: '2029-10-11',
  isDone: false
});

const todo_6 = createTestTodo({
  id: '000006',
  task: 'bring bang bang',
  priority: 'low',
  deadline: '2027-09-28',
  isDone: false
});

const testTodos: Todo[] = [todo_5, todo_2, todo_4, todo_1, todo_6, todo_3];

describe('computeViewTodos() のテスト', { todo: true }, () => {
  describe('todosComparerMap のテスト', () => {
    it('id の前後', (t: TestContext) => {
      t.assert.strictEqual(todosComparerMap.id(todo_1, todo_3) < 0, true);
      t.assert.strictEqual(todosComparerMap.id(todo_1, todo_1) === 0, true);
      t.assert.strictEqual(todosComparerMap.id(todo_4, todo_1) > 0, true);
    });

    it('task の前後', (t: TestContext) => {
      t.assert.strictEqual(todosComparerMap.task(todo_3, todo_4) < 0, true);
      t.assert.strictEqual(todosComparerMap.task(todo_3, todo_3) === 0, true);
      t.assert.strictEqual(todosComparerMap.task(todo_2, todo_3) > 0, true);
    });

    it('priority の前後', (t: TestContext) => {
      t.assert.strictEqual(todosComparerMap.priority(todo_5, todo_6) < 0, true);
      t.assert.strictEqual(todosComparerMap.priority(todo_5, todo_5) === 0, true);
      t.assert.strictEqual(todosComparerMap.priority(todo_5, todo_4) > 0, true);
    });

    it('deadline の前後', (t: TestContext) => {
      t.assert.strictEqual(todosComparerMap.deadline(todo_6, todo_5) < 0, true);
      t.assert.strictEqual(todosComparerMap.deadline(todo_5, todo_5) === 0, true);
      t.assert.strictEqual(todosComparerMap.deadline(todo_5, todo_3) > 0, true);
    });

    it('isDone の前後', (t: TestContext) => {
      t.assert.strictEqual(todosComparerMap.isDone(todo_6, todo_3) < 0, true);
      t.assert.strictEqual(todosComparerMap.isDone(todo_4, todo_5) === 0, true);
      t.assert.strictEqual(todosComparerMap.isDone(todo_1, todo_2) === 0, true);
      t.assert.strictEqual(todosComparerMap.isDone(todo_2, todo_4) > 0, true);
    });
  });

  describe('isCloseToDeadline() のテスト', () => {
    beforeEach(() => {
      mock.timers.enable({ apis: ['Date'], now: new Date(2026, 7, 5) /* 2026年8月5日 */ });
    });
    afterEach(() => {
      mock.timers.reset();
    });

    it('期限が過ぎていれば false', (t: TestContext) => {
      t.assert.strictEqual(isCloseToDeadline('2026-08-02' as ValidDeadline), false);
    });
    it('期限が ${thresholdDays} 日後以降なら false', (t: TestContext) => {
      t.assert.strictEqual(isCloseToDeadline('2027-08-12' as ValidDeadline), false);
      t.assert.strictEqual(isCloseToDeadline('2026-08-12' as ValidDeadline), false);
      t.assert.strictEqual(isCloseToDeadline('2026-08-06' as ValidDeadline, 0), false);
    });
    it('期限が ${thresholdDays - 1} 以内なら true', (t: TestContext) => {
      t.assert.strictEqual(isCloseToDeadline('2026-08-07' as ValidDeadline), true);
      t.assert.strictEqual(isCloseToDeadline('2026-08-11' as ValidDeadline), true);
      t.assert.strictEqual(isCloseToDeadline('2026-08-12' as ValidDeadline, 8), true);
    });
  });

  describe('全体のテスト', () => {
    it('sort: { order: "ascend", type: "deadline" } / filter: "all" の時：期日の早い順にソート', (t: TestContext) => {
      const testTodoStateDeadline = createTestTodoState(testTodos, { order: 'ascend', type: 'deadline' }, 'all');

      t.assert.deepStrictEqual(computeViewTodos(testTodoStateDeadline), [
        todo_2,
        todo_6,
        todo_3,
        todo_1,
        todo_5,
        todo_4
      ]);
    });

    it('sort: { order: "descend", type: "id" } / filter: "all" の時：id 逆順にソート', (t: TestContext) => {
      const testTodoStateIdDesc = createTestTodoState(testTodos, { order: 'descend', type: 'id' }, 'all');

      t.assert.deepStrictEqual(computeViewTodos(testTodoStateIdDesc), [todo_6, todo_5, todo_4, todo_3, todo_2, todo_1]);
    });

    it('sort: { order: "ascend", type: "task" } / filter: "incomplete" の時：ソートとフィルタが適用され、元の配列は編集されない', (t: TestContext) => {
      const testTodoStateTaskIncomplete = createTestTodoState(
        testTodos,
        { order: 'ascend', type: 'task' },
        'incomplete'
      );

      t.assert.deepStrictEqual(computeViewTodos(testTodoStateTaskIncomplete), [todo_6, todo_5, todo_4]);
      t.assert.deepStrictEqual(testTodoStateTaskIncomplete.todos, testTodos);
    });
  });
});
