import type { Store } from '../libs/createStore.js';
import type { RemoveAllMode, UIState } from '../types/uiState.js';

export function createUIActions(uiStore: Store<UIState>) {
  const toggleDialogOpen = (toOpen: boolean) => uiStore.dispatch((s) => ({ ...s, removeDialogOpen: toOpen }));

  const changeRemoveAllMode = (key: keyof RemoveAllMode, checked: boolean) =>
    uiStore.dispatch((s) => ({ ...s, removeAllMode: { ...s.removeAllMode, [key]: checked } }));

  return { toggleDialogOpen, changeRemoveAllMode };
}
