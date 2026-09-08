// --- utilities ---
export const existsTrueVal = <T extends number | string | symbol>(obj: Record<T, boolean>): boolean =>
  Object.entries(obj).some(([_, v]) => v === true);

export const shallowObjectEqual = <V extends { [k: string]: any }>(a: V, b: V): boolean =>
  a === b ? true : Object.entries(a).every(([k, v]) => v === b[k]);
