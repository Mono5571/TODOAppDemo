import type { CreateTodoResponse, FindAllTodosResponse, Todo, TodoId } from '@todo/shared';
import type { ApiClient } from '../../api/types/ApiClient.js';
import type { InputTodo, UpdateTodo } from '../../types/inputs.js';
import type { TodoRepository } from './types.js';

// とりあえずバックエンドから Response として渡された値への検証はしない
export function createTodoRepository(apiClient: ApiClient): TodoRepository {
  const path = '/todos';
  return {
    findAll: () => apiClient.get<FindAllTodosResponse>(path, (data): data is Todo[] => true /* isTodoArray */),
    create: (input: InputTodo) =>
      apiClient.post<CreateTodoResponse>(path, input, (data): data is Todo => true /* isTodo */),
    update: (id: TodoId, input: UpdateTodo) => apiClient.patch(`${path}/${id}`, input),
    remove: (id: TodoId) => apiClient.remove(`${path}/${id}`)
  };
}
