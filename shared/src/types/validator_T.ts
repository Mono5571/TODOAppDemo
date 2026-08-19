export type Validator<T> = (data: unknown) => data is T;
