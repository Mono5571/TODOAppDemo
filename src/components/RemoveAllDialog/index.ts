import { todoActions, uiActions, uiStore } from '../../context/index.js';
import { createElement } from '../../libs/createElement/index.js';
import { removeAllModeKeys, type RemoveAllMode } from '../../types/uiState.js';
import { existsTrueVal, isElement } from '../../utils/utils.js';

export function initRemoveAllDialog(container: HTMLElement) {
  const handleCheck = (e?: Event) => {
    const target = e?.currentTarget;
    if (target instanceof HTMLInputElement && isElement(target.value, removeAllModeKeys))
      uiActions.changeRemoveAllMode(target.value, target.checked);
  };

  const checkboxIDs = { removeDone: 'checkbox__removeDone', removeEpired: 'checkbox__removeExpired' } as const;

  const toggleButtonText = {
    isClose: 'まとめて削除',
    isOpen: '閉じる'
  } as const;

  try {
    // 開閉ボタン: ダイアログの外
    const toggleButton = createElement('button', {
      type: 'button',
      className: 'button__toggle-remove-all-dialog',
      textContent: toggleButtonText.isClose,
      onClick: () => uiActions.toggleDialogOpen(!uiStore.state.removeDialogOpen)
    });

    // --- ダイアログの中
    const submitButton = createElement('button', {
      type: 'button',
      className: 'button__submit-remove-all-dialog',
      textContent: '削除',
      onClick: () => {
        todoActions.removeAll(uiStore.state.removeAllMode);
      }
    });

    const closeButton = createElement('button', {
      type: 'button',
      className: 'button__close-remove-all-dialog',
      textContent: 'x',
      onClick: () => uiActions.toggleDialogOpen(false)
    });

    const removeAllDialog = createElement(
      'div',
      { className: 'remove-all-dialog' },
      createElement('input', {
        type: 'checkbox',
        id: checkboxIDs.removeDone,
        value: 'removeDone',
        checked: 'true',
        onChange: handleCheck
      }),
      createElement('label', { for: checkboxIDs.removeDone, textContent: '完了済み' }),
      createElement('input', {
        type: 'checkbox',
        id: checkboxIDs.removeEpired,
        value: 'removeExpired',
        onChange: handleCheck
      }),
      createElement('label', { for: checkboxIDs.removeEpired, textContent: '期限切れ' }),
      submitButton,
      closeButton
    );
    // ---

    uiStore.watch(
      (s) => s.removeDialogOpen,
      (toOpen: boolean) => {
        if (removeAllDialog.classList.contains('is-open') !== toOpen) {
          removeAllDialog.classList.toggle('is-open');
          toggleButton.textContent = toOpen ? toggleButtonText.isOpen : toggleButtonText.isClose;
        }
      }
    );

    uiStore.watch(
      (s) => s.removeAllMode,
      (mode: RemoveAllMode) => {
        submitButton.disabled = !existsTrueVal(mode);
      }
    );

    container.appendChild(toggleButton);
    container.appendChild(removeAllDialog);
  } catch (error) {
    if (error instanceof Error) console.error(`error occurred on remove all dialog initialization: ${error}`);
    console.error('unknown error occurred on remove all dialog initialization');
  }
}
