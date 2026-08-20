import { initFilterSelect } from './components/FilterSelect/index.js';
import { initRemoveAllDialog } from './components/RemoveAllDialog/index.js';
import { initTodoForm } from './components/TodoForm/index.js';
import { initTodoTable } from './components/TodoTable/index.js';
import { todoRepository, todoStore } from './context/index.js';
import { initTodoRepository } from './repositories/todoRepository/initTodoRepository.js';
// import { initTodoDB } from './TodoDB/initTodoDB.js';

const main = () => {
  const filterSlectContainer = document.getElementById('filter-select-container');

  const removeAllDialogContainer = document.getElementById('remove-all-dialog-container');

  const tableContainer = document.getElementById('table-container');

  const formContainer = document.getElementById('form-container');

  if (
    !(filterSlectContainer instanceof HTMLElement) ||
    !(removeAllDialogContainer instanceof HTMLElement) ||
    !(tableContainer instanceof HTMLElement) ||
    !(formContainer instanceof HTMLElement)
  ) {
    console.error('要素が存在しないか、誤ったタグが指定されています。');
    return;
  }

  initFilterSelect(filterSlectContainer);

  initRemoveAllDialog(removeAllDialogContainer);

  initTodoTable(tableContainer);

  initTodoForm(formContainer);

  initTodoRepository(todoRepository, todoStore);
};

document.addEventListener('DOMContentLoaded', main);
