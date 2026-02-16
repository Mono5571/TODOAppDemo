import type { Success, Failure } from '../types/result.js';

const createResult = <D, E>() => {
  const createSuccess = (data: D): Success<D> => ({ isSuccess: true, data });

  const createFailure = (error: E): Failure<E> => ({ isSuccess: false, error });

  return { createSuccess, createFailure };
};

export { createResult };
