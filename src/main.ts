import { initTodoForm } from './components/TodoForm/index.js';
import { initTodoTable } from './components/TodoTable/index.js';
import { createDB } from './TodoDB/createDB.js';
import { initTodoDB } from './TodoDB/initTodoDB.js';
import { mockInitialData } from './TodoDB/test/test_mockDB.js'; // テスト用

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

  // DB インスタンスの生成
  const db = createDB({ label: 'mock', initialData: mockInitialData });
  // データの読み込みをおこない、TodoStore に save() を購読させる
  initTodoDB(db);
};

document.addEventListener('DOMContentLoaded', main);

// --- What TO DO ---
/*
4. delete の実装
*/
