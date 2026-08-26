import type { CreateTodoResponse, FindAllTodosResponse, RemoveAllTodoResponse, Todo, TodoId } from '@todo/shared';
import type { ApiClient } from '../../api/types/ApiClient.js';
import type { InputTodo, UpdateTodo } from '@todo/shared';
import type { TodoRepository } from './types.js';

// とりあえずバックエンドから Response として渡された値への検証はしない
export function createTodoRepository(apiClient: ApiClient): TodoRepository {
  const path = '/todos';
  return {
    findAll: () => apiClient.get<FindAllTodosResponse>(path, (_data): _data is Todo[] => true /* isTodoArray */),
    create: (input: InputTodo) =>
      apiClient.post<CreateTodoResponse>(path, input, (_data): _data is Todo => true /* isTodo */),
    update: (id: TodoId, input: UpdateTodo) => apiClient.patch(`${path}/${id}`, input),
    delete: (id: TodoId) => apiClient.delete(`${path}/${id}`),
    deleteAll: (ids: TodoId[]) =>
      apiClient.put<RemoveAllTodoResponse>(path, { ids: ids }, (_data): _data is Todo[] => true /* isTodoArray */)
  };
}
