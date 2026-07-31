import type { Success, Failure } from '../types/result.js';

const createResult = <D, E>() => {
  const createSuccess = (data: D): Success<D> => ({ ok: true, data });

  const createFailure = (err: E): Failure<E> => ({ ok: false, err });

  return { createSuccess, createFailure };
};

export { createResult };
