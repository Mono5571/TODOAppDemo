type Success<D> = {
  readonly isSuccess: true;
  readonly data: D;
};

type Failure<E> = {
  readonly isSuccess: false;
  readonly error: E;
};

type Result<D, E> = Success<D> | Failure<E>;

export type { Success, Failure, Result };
