type Success<D> = {
  readonly isSuccess: true;
  readonly data: D;
  readonly error: never;
};

type Failure<E> = {
  readonly isSuccess: false;
  readonly error: E;
  readonly data: never;
};

type Result<D, E> = Success<D> | Failure<E>;

export type { Success, Failure, Result };
