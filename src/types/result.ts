type Success<D> = {
  readonly ok: true;
  readonly data: D;
};

type Failure<E> = {
  readonly ok: false;
  readonly err: E;
};

type Result<D, E> = Success<D> | Failure<E>;

export type { Success, Failure, Result };
