import { todoActions, uiActions, uiStore } from '../../context/index.js';
import { createElement } from '../../libs/createElement/index.js';
import { removeAllModeKeys, type RemoveAllMode, type UIState } from '../../types/uiState.js';
import { refreshContainer } from '../../utils/refreshContainer.js';
import { existsTrueVal, isElement } from '../../utils/utils.js';

export function initRemoveAllDialog(container: HTMLElement) {
  // モード切替のチェックボックスに設置するイベントリスナ
  const handleCheck = (e?: Event) => {
    const target = e?.currentTarget;
    if (target instanceof HTMLInputElement && isElement(target.value, removeAllModeKeys))
      uiActions.changeRemoveAllMode(target.value, target.checked);
  };

  const checkboxIDs: { [key in keyof RemoveAllMode]: string } = {
    removeDone: 'checkbox__removeDone',
    removeExpired: 'checkbox__removeExpired'
  } as const;

  const renderDialog = (state: UIState) => {
    try {
      // 開閉ボタン：ダイアログの外
      const toggleButton = createElement('button', {
        type: 'button',
        className: 'button__toggle-remove-all-dialog',
        textContent: state.removeDialogOpen ? '閉じる' : 'まとめて削除',
        onClick: () => uiActions.toggleDialogOpen(!state.removeDialogOpen)
      });

      // ---
      // ダイアログの中
      const submitButton = createElement('button', {
        type: 'button',
        className: 'button__submit-remove-all-dialog',
        textContent: '削除',
        disabled: `${!existsTrueVal(state.removeAllMode)}`,
        onClick: () => {
          todoActions.removeAll(state.removeAllMode);
        }
      });

      const closeButton = createElement('button', {
        type: 'button',
        className: 'button__close-remove-all-dialog',
        textContent: 'x',
        onClick: () => uiActions.toggleDialogOpen(false)
      });

      const removeDoneCheckbox = createElement('input', {
        type: 'checkbox',
        id: checkboxIDs.removeDone,
        value: 'removeDone',
        checked: `${state.removeAllMode.removeDone}`,
        onChange: handleCheck
      });

      const removeExpiredCheckbox = createElement('input', {
        type: 'checkbox',
        id: checkboxIDs.removeExpired,
        value: 'removeExpired',
        checked: `${state.removeAllMode.removeExpired}`,
        onChange: handleCheck
      });

      const removeAllDialog = createElement(
        'div',
        { className: ['remove-all-dialog', state.removeDialogOpen && 'is-open'].filter(Boolean).join(' ') },
        removeDoneCheckbox,
        createElement('label', { for: checkboxIDs.removeDone, textContent: '完了済み' }),
        removeExpiredCheckbox,
        createElement('label', { for: checkboxIDs.removeExpired, textContent: '期限切れ' }),
        submitButton,
        closeButton
      );

      // ---

      return { toggleButton, removeAllDialog };
    } catch (error) {
      if (error instanceof Error) console.error(`error occurred on rendering remove all dialog: ${error}`);
      console.error('unknown error occurred on rendering remove all dialog');
    }
  };

  const commitDialog = (state: UIState) => {
    refreshContainer(container);
    const { toggleButton, removeAllDialog } = renderDialog(state) ?? { toggleButton: null, removeAllDialog: null };

    if (!toggleButton || !removeAllDialog) return;

    container.appendChild(toggleButton);
    container.appendChild(removeAllDialog);
  };

  // 初回レンダリング
  commitDialog(uiStore.state);

  const unsubsribeRenderDialog = uiStore.watch((s) => s, commitDialog);
}
