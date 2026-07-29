import type { FilterState, TodoState } from '../../types/todoState.js';
import type { Priority, Todo, TodoKey, ValidDeadline } from '../../domain/Todo/types.js';

// sort
// ---
const priorityNumberMap = {
  low: 0,
  middle: 1,
  high: 2
} as const satisfies { [key in Priority]: number };

/**
 * 'yyyy-mm-dd' 形式の日付文字列を二つ引数にとり、前者が後者より前なら -1 を、同じなら 0 を、先なら 1 を返す関数
 */
function compareDeadline(dA: ValidDeadline, dB: ValidDeadline) {
  if (dA === dB) return 0;
  const [aDateInt, bDateInt] = [parseInt(dA.replaceAll(/-/g, '')), parseInt(dB.replaceAll(/-/g, ''))];
  return aDateInt > bDateInt ? 1 : -1;
}

// array.prototype.toSorted() に渡す評価関数の keyMap
const todosComparerMap = {
  id: (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10),
  task: (a, b) => a.task.localeCompare(b.task), // もう少し厳密に
  priority: (a, b) => priorityNumberMap[b.priority] - priorityNumberMap[a.priority],
  deadline: (a, b) => compareDeadline(a.deadline, b.deadline),
  isDone: (a, b) => (a.isDone ? (b.isDone ? 0 : 1) : b.isDone ? -1 : 0)
} as const satisfies { [key in TodoKey]: (a: Todo, b: Todo) => number };
// ---

// filter
// ---
function isCloseToDeadline(d: ValidDeadline, daysCriteria: number = 7): boolean {
  const now = new Date();
  const deadlineDate = new Date(d);

  const diffTime = deadlineDate.getTime() - now.getTime();
  // [ミリ秒] から [日] に変換
  const diffDays = diffTime / (24 * 60 * 60 * 1000);

  return 0 <= diffDays && diffDays <= daysCriteria;
}

// array.prototype.filter() に渡す評価関数の keyMap
const todosFiltererMap = {
  all: (t) => true,
  priorityHigh: (t) => (t.priority === 'high' ? true : false),
  incomplete: (t) => !t.isDone,
  closeToDeadline: (t) => isCloseToDeadline(t.deadline)
} as const satisfies { [key in FilterState]: (t: Todo) => boolean };
// ---

export function computeViewTodos(state: TodoState): Todo[] {
  const filteredTodos = state.todos.filter(todosFiltererMap[state.filter]);

  const compare = todosComparerMap[state.sort.type];
  return filteredTodos.toSorted(state.sort.order === 'ascend' ? compare : (a, b) => compare(b, a));
}
