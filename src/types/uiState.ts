export const removeAllModeKeys = ['removeDone', 'removeExpired'] as const;

export type RemoveAllMode = { readonly [key in (typeof removeAllModeKeys)[number]]: boolean };

export interface UIState {
  readonly removeAllMode: RemoveAllMode;
  readonly removeDialogOpen: boolean;
}
