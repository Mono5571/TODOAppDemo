import { todoActions } from '../../context/index.js';
import { createElement } from '../../libs/createElement/index.js';
import { filterStateList, type FilterState } from '../../types/todoState.js';
import { isElement } from '@todo/shared';

// option 要素の value と textContent のタプルの配列
const filterOptionsValueTextList: [FilterState, string][] = [
  ['all', 'すべてのタスク'],
  ['priorityHigh', '優先度: 高 のみ'],
  ['incomplete', '未完了 のみ'],
  ['closeToDeadline', '期日間近 のみ']
] as const;

export function initFilterSelect(container: HTMLElement) {
  try {
    // ラベル
    const filterSelectLabel = createElement('label', { for: 'filter-select', textContent: 'フィルター: ' });

    // option 要素
    const filterOptions = filterOptionsValueTextList.map((tuple) =>
      createElement('option', { value: tuple[0], textContent: tuple[1] })
    );

    // select 要素本体
    const filterSelect = createElement(
      'select',
      {
        name: 'filter-type',
        id: 'filter-select',
        onChange: (e) => {
          if (e === undefined) return;
          const select = e.currentTarget;
          if (!(select instanceof HTMLSelectElement)) return;
          todoActions.filterBy(isElement(select.value, filterStateList) ? select.value : 'all');
        }
      },
      ...filterOptions
    );

    container.appendChild(filterSelectLabel);
    container.appendChild(filterSelect);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`error occured on initializing filter select: ${error.message}`);
      return;
    }

    console.error('unknown error occured on initializing filter select');
  }
}
