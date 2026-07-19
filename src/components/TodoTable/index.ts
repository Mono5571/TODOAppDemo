import { todoStore } from '../../context/index.js';
import { refreshContainer } from '../../utils/refreshContainer.js';
import { renderTable } from './renderer.js';
import { selectViewTodos } from './selector.js';

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
