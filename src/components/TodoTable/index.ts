import { todoStore } from '../../context/index.js';
import { renderTable } from './renderer.js';
import { selectViewTodos } from './selector.js';

const refreshContainer = (container: HTMLElement) => {
  while (container.firstElementChild) {
    container.removeChild(container.firstElementChild);
  }
};

export const initTodoTable = (container: HTMLElement) => {
  const unsubscribeRenderTable = todoStore.watch(
    (s) => selectViewTodos(s),
    (s) => {
      refreshContainer(container);
      const table = renderTable(s);
      if (table) container.appendChild(table);
    },
    (a, b) => {
      if (a === b) return true;
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    }
  );
};
