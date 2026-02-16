// --- utilities ---
const isElement = <E extends string>(maybeElement: string, listOfElement: readonly E[]): maybeElement is E =>
  listOfElement.some((e) => e === maybeElement);

const isKey = <T extends { [key: string]: any }>(key: string | number | symbol, keyMap: T): key is keyof T =>
  Object.hasOwn(keyMap, key);

const shallowObjectEqual = <V extends { [k: string]: any }>(a: V, b: V): boolean => {
  if (a === b) return true;
  return Object.entries(a).every(([k, v]) => v === b[k]);
};

export { isElement, isKey, shallowObjectEqual };
