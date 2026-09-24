export const isElement = <T, E extends T>(maybeElement: T, elements: readonly E[]): maybeElement is E =>
  elements.some((e) => e === maybeElement);
