export function hasProperty<const T extends string | number | symbol>(
  obj: object,
  key: T
): obj is { [K in T]: unknown } {
  return Object.hasOwn(obj, key);
}
