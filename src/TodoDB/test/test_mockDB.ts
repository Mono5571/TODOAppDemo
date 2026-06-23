import type { InputValues } from '../../types/inputs.js';
import type { Todo } from '../../types/todo.js';
import { generateTodo } from '../../utils/generateTodo.js';
import { generateTodoId } from '../../utils/generateTodoId.js';
import { validateInputValues } from '../../validators/validateInputValues.js';

function generateMockData(inputs: InputValues[]): Todo[] {
  return inputs
    .map((i) => {
      const idResult = generateTodoId();
      if (!idResult.isSuccess) {
        console.error('failed to generate todo id.');
        return null;
      }

      const inputResult = validateInputValues(i);
      if (!inputResult.isSuccess) {
        console.error(
          `invalid mock input: task: ${inputResult.error.task} / priority: ${inputResult.error.priority} / deadline: ${inputResult.error.deadline}`
        );
        return null;
      }

      return generateTodo({ validData: inputResult.data, id: idResult.data, isDone: false });
    })
    .filter((d) => d != null);
}

const mockInputs: InputValues[] = [
  {
    task: 'amenbo',
    priority: 'high',
    deadline: '2027-05-11'
  },
  {
    task: 'english lesson',
    priority: 'low',
    deadline: '2026-09-08'
  },
  {
    task: 'oishii gohan taberu', // 16 文字以上、検証失敗
    priority: 'low',
    deadline: '2026-10-08'
  },
  {
    task: 'bakuhatsu',
    priority: 'middle',
    deadline: '2026-07-01'
  },
  {
    task: 'gottsandesu',
    priority: 'high',
    deadline: '2026-06-28'
  },
  {
    task: 'chat with a cat',
    priority: 'middle',
    deadline: '2026-08-18'
  },
  {
    task: 'mecha mecha nagai moziretsu de hyouzi sare nai', // error
    priority: 'extra', // error
    deadline: '2026-04-27' // error -> 実際は error にならないほうがいい
  }
];

export const mockInitialData: Todo[] = generateMockData(mockInputs);
