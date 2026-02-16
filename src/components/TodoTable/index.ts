import { todoStore, todoActions } from '../../TodoStore/index.js';
import { renderTable } from './renderer.js';

const refreshContainer = (container: HTMLElement) => {
  while (container.firstElementChild) {
    container.removeChild(container.firstElementChild);
  }
};

export const initTodoTable = (container: HTMLElement) => {
  const unsubscribeRenderTable = todoStore.watch(
    (todos) => todos,
    (todos) => {
      refreshContainer(container);
      const table = renderTable(todos);
      if (table) container.appendChild(table);
    },
    (a, b) => {
      if (a === b) return true;
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    }
  );
};
