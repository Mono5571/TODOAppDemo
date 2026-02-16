import { cast } from './castBranded.js';

export const generateTodoId = (() => {
  let count = 0;
  return () => {
    count = count + 1;
    return cast.todoId(count.toString().padStart(6, '0'));
  };
})();
