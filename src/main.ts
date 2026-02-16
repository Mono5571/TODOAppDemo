import { initTodoForm } from './components/TodoForm/index.js';
import { initTodoTable } from './components/TodoTable/index.js';

const main = () => {
  const tableContainer = document.getElementById('table-container');

  const taskInput = document.getElementById('input-task');
  const prioritySelect = document.getElementById('select-priority');
  const deadlineInput = document.getElementById('input-deadline');

  const taskError = document.getElementById('error-task');
  const priorityError = document.getElementById('error-priority');
  const deadlineError = document.getElementById('error-deadline');

  const submit = document.getElementById('submit');

  if (
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

  initTodoTable(tableContainer);

  initTodoForm({ taskInput, prioritySelect, deadlineInput, taskError, priorityError, deadlineError, submit });
};

document.addEventListener('DOMContentLoaded', main);

// --- What TO DO ---
/*
4. module tree 書く
5. storage 保存と読み込みの処理
*/
