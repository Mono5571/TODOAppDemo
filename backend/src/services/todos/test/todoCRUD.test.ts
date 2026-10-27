import { describe, it, type TestContext } from 'node:test';
import {
  createMockSuccessTodoRepository,
  createMockFailureTodoRepository
} from '../../../repositories/todo/mockTodoRepository.ts';
import type { Todo } from '@todo/shared';

type MaybeTodo = {
  id: number;
  task: string;
  priority: 'low' | 'middle' | 'high';
  deadline: string;
  isDone: boolean;
};

function createTestTodo(todo: MaybeTodo): Todo {
  return todo as Todo;
}

const mockSuccessRepo = createMockSuccessTodoRepository([]);
const mockFailureRepo = createMockFailureTodoRepository();

describe('Todo Service --ビジネスロジックに基づく入力値検証と、DB の読み書き処理-- の検証', { todo: true }, () => {
  describe('createTodo のテスト', () => {
    it();
  });
});
