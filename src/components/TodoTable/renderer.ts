import type { Priority, Todo, TodoId } from '../../types/todo.js';
import { createElement } from '../../libs/createElement.js';
import { todoActions } from '../../TodoStore/index.js';

const priorityMap: { [key in Priority]: string } = {
  low: '低',
  middle: '並',
  high: '高'
};

const createTodoRow = (todo: Todo): HTMLTableRowElement | undefined => {
  const checkbox = createElement('input', { type: 'checkbox', checked: `${todo.isDone}`, className: 'todo-check' });
  if (!(checkbox instanceof HTMLInputElement)) return;
  checkbox.addEventListener('change', () => todoActions.toggleDone(todo.id));

  const todoRow = createElement(
    'tr',
    { className: todo.isDone ? 'is-done' : '' },
    createElement('td', {}, todo.task),
    createElement('td', {}, priorityMap[todo.priority]),
    createElement('td', {}, todo.deadline),
    createElement('td', {}, checkbox)
  );

  if (!(todoRow instanceof HTMLTableRowElement)) return;
  return todoRow;
};

export const renderTable = (todos: Todo[]): HTMLTableElement | undefined => {
  const thead = createElement(
    'thead',
    {},
    createElement(
      'tr',
      {},
      createElement('th', { id: 'todoLabel1' }, 'TODO'),
      createElement('th', {}, '優先度'),
      createElement('th', { id: 'dateLabel1' }, '期日'),
      createElement('th', {}, '完了')
    )
  );

  const tbody = createElement(
    'tbody',
    {},
    ...todos.map((todo) => createTodoRow(todo)).filter((r): r is NonNullable<typeof r> => r != null)
  );

  const table = createElement('table', { id: 'table' }, thead, tbody);
  if (!(table instanceof HTMLTableElement)) return;
  return table;
};
