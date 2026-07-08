import { initFilterSelect } from './components/FilterSelect/index.js';
import { initTodoForm } from './components/TodoForm/index.js';
import { initTodoTable } from './components/TodoTable/index.js';
import { db } from './context/index.js';
import { initTodoDB } from './context/initTodoDB.js';

const main = () => {
  const filterSlectContainer = document.getElementById('filter-select-container');
  const tableContainer = document.getElementById('table-container');

  const taskInput = document.getElementById('input-task');
  const prioritySelect = document.getElementById('select-priority');
  const deadlineInput = document.getElementById('input-deadline');

  const taskError = document.getElementById('error-task');
  const priorityError = document.getElementById('error-priority');
  const deadlineError = document.getElementById('error-deadline');

  const submit = document.getElementById('submit');

  if (
    !(filterSlectContainer instanceof HTMLElement) ||
    !(tableContainer instanceof HTMLElement) ||
    !(taskInput instanceof HTMLInputElement) ||
    !(prioritySelect instanceof HTMLSelectElement) ||
    !(deadlineInput instanceof HTMLInputElement) ||
    !(taskError instanceof HTMLSpanElement) ||
    !(priorityError instanceof HTMLSpanElement) ||
    !(deadlineError instanceof HTMLSpanElement) ||
    !(submit instanceof HTMLButtonElement)
  ) {
    console.error('要素が存在しないか、誤ったタグが指定されています。');
    return;
  }

  initFilterSelect(filterSlectContainer);

  initTodoTable(tableContainer);

  initTodoForm({ taskInput, prioritySelect, deadlineInput, taskError, priorityError, deadlineError, submit });

  initTodoDB(db);
};

document.addEventListener('DOMContentLoaded', main);
