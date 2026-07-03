import type { Priority, Todo, TodoKey } from '../../types/todo.js';
import { createElement } from '../../libs/createElement/index.js';
import { todoActions } from '../../todoActions/index.js';
import { isFutureOrToday } from '../../utils/dateStringValidator.js';

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

    // タスクを削除するボタン要素の生成
    const removeButton = createElement('button', {
      type: 'button',
      className: 'todo-remove-button',
      textContent: '削除',
      onClick: () => todoActions.remove(todo.id)
    });

    // 行要素の生成
    const todoRow = createElement(
      'tr',
      {
        // 短絡評価: todo.isDone === true の時だけ 'is-done' が評価される。これは truthy な値なので、filter で残る
        className: [todo.isDone && 'is-done', !isFutureOrToday(todo.deadline) && 'is-expired'].filter(Boolean).join(' ')
      },
      createElement('td', {}, todo.task),
      createElement('td', {}, priorityMap[todo.priority]),
      createElement('td', {}, todo.deadline),
      createElement('td', {}, checkbox),
      createElement('td', {}, removeButton)
    );

    return todoRow;
  } catch (e) {
    if (e instanceof Error) throw e;

    throw new Error('unknown error occured on executing createTodoRow().');
  }
};

const sortButtonTextContentMap = {
  task: 'TODO',
  priority: '優先度',
  deadline: '期日',
  isDone: '完了'
} as const satisfies { [key in Exclude<TodoKey, 'id'>]: string };

/**
 * ソートボタンを作成する **throwable** な補助関数
 * @param textContent keyMap から読み込み
 * @param sortType toggleSort に渡す type: TodoKey
 * @returns
 */
function createSortButton(todoKey: Exclude<TodoKey, 'id'>): HTMLButtonElement {
  try {
    const sortButton = createElement('button', {
      type: 'button',
      className: 'sort-button',
      textContent: sortButtonTextContentMap[todoKey],
      onClick: () => {
        todoActions.toggleSort(todoKey);
      }
    });

    return sortButton;
  } catch (e) {
    if (e instanceof Error) throw e;

    throw new Error('unknown error occured on sort button creation.');
  }
}

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
        createElement('th', { id: 'todoLabel1' }, createSortButton('task')),
        createElement('th', {}, createSortButton('priority')),
        createElement('th', { id: 'dateLabel1' }, createSortButton('deadline')),
        createElement('th', {}, createSortButton('isDone')),
        // 削除ボタンの列のヘッダ
        createElement('th')
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

    return table;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error on executing renderTable(): ${e.message}`);
      return;
    }
    console.error('unknown error occured on executing renderTable().');
  }
};
