import type { Priority, Todo } from '../../types/todo.js';
import { createElement } from '../../libs/createElement.js';
import { todoActions } from '../../TodoStore/index.js';

// コード上の priority: string と、画面に表示される優先度を対応付ける keyMap オブジェクト
const priorityMap = {
  low: '低',
  middle: '並',
  high: '高'
} as const satisfies { [key in Priority]: string };

/**
 * Todo を受け取って HTML の table の行要素を返す関数
 *
 * 行にはタスク、優先度、期日に加え、完了状況を入力できるチェックボックスが含まれる
 * @param todo Todo
 * @returns todoRow: 行要素 | undefined
 */
const createTodoRow = (todo: Todo): HTMLTableRowElement | undefined => {
  try {
    // タスクの完了状況を入力できるチェックボックス要素の生成
    const checkbox = createElement('input', {
      type: 'checkbox',
      checked: `${todo.isDone}`,
      className: 'todo-check',
      onChange: () => todoActions.toggleDone(todo.id)
    });
    if (!(checkbox instanceof HTMLInputElement)) return;

    // 行要素の生成
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
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error on executing createTodoRow(): ${e.message}`);
      return;
    }
    console.error('unknown error occured on executing createTodoRow().');
  }
};

/**
 * todoStore に格納された State(= Todo[]) を受け取り、新しい HTML の 表要素を返す関数
 * @param todos Todo[]
 * @returns table: 表要素 | undefined
 */
export const renderTable = (vs: Todo[]): HTMLTableElement | undefined => {
  try {
    // todoTable のヘッダを生成
    const thead = createElement(
      'thead',
      {},
      createElement(
        'tr',
        {},
        createElement(
          'th',
          { id: 'todoLabel1' },
          // ソートボタン: task
          createElement('button', {
            type: 'button',
            className: 'sort-button',
            textContent: 'TODO',
            onClick: () => {
              todoActions.sortBy('task');
            }
          })
        ),
        createElement(
          'th',
          {},
          // ソートボタン: priority
          createElement('button', {
            type: 'button',
            className: 'sort-button',
            textContent: '優先度',
            onClick: () => {
              todoActions.sortBy('priority');
            }
          })
        ),
        createElement(
          'th',
          { id: 'dateLabel1' },
          // ソートボタン: deadline
          createElement('button', {
            type: 'button',
            className: 'sort-button',
            textContent: '期日',
            onClick: () => {
              todoActions.sortBy('deadline');
            }
          })
        ),
        createElement(
          'th',
          {},
          // ソートボタン: isDone
          createElement('button', {
            type: 'button',
            className: 'sort-button',
            textContent: '完了',
            onClick: () => {
              todoActions.sortBy('isDone');
            }
          })
        )
      )
    );

    // todos から todo をひとつずつとりだして行要素を生成し、todoTable のボディをつくる
    // null または undefined の行要素は取り除く
    const tbody = createElement(
      'tbody',
      {},
      ...vs.map((v) => createTodoRow(v)).filter((r): r is NonNullable<typeof r> => r != null)
    );

    // thead と tbody を 子要素にもつ todoTable 本体の table 要素を生成
    const table = createElement('table', { id: 'table' }, thead, tbody);
    if (!(table instanceof HTMLTableElement)) return;

    return table;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error on executing renderTable(): ${e.message}`);
      return;
    }
    console.error('unknown error occured on executing renderTable().');
  }
};
