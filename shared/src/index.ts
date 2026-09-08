// types
export type { Branded } from './types/branded.js';

export type { Result, Success, Failure } from './types/result.js';

export type { AtLeastOne } from './types/atLeastOne.js';

export type { Validator } from './types/validator_T.js';

// Todo
export {
  todoKeyList,
  TODO_ID_COUNT_MAX,
  TASK_MAX_LENGTH,
  priorityList,
  DEADLINE_THRESHOLD_DAYS
} from './Todo/constants.js';

export type { TodoKey, TodoId, ValidTask, Priority, ValidDeadline, Todo } from './Todo/types.js';

export { isPriority } from './Todo/utils.js';
export { isValidDeadline } from './Todo/validators/isValidDeadline.js';

// InputTodo
export { inputKeyList } from './InputTodo/constants.js';
export type { InputTodoKey, InputTodo, InputValues, UpdateTodo } from './InputTodo/types.js';

// utils
export { isElement } from './utils/isElement.js';
export { hasProperty } from './utils/hasProperty.js';

export { parseLocalDateNums, isValidDateNums, isFutureOrToday } from './utils/dateStringValidator.js';
export { isValidUrlString } from './utils/isValidUrlString.js';

// api
export type { FindAllTodosResponse, CreateTodoResponse, RemoveAllTodoResponse } from './api/TodosResponse.js';
