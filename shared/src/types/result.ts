export type Success<D> = {
  readonly ok: true;
  readonly data: D;
};

export type Failure<E> = {
  readonly ok: false;
  readonly err: E;
};

export type Result<D, E> = Success<D> | Failure<E>;
