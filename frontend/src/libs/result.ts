import type { Result, Success, Failure } from '@todo/shared';

export const createResult = <D, E>() => {
  const createSuccess = (data: D): Success<D> => ({ ok: true, data });

  const createFailure = (err: E): Failure<E> => ({ ok: false, err });

  return { createSuccess, createFailure };
};

/** Type Predicator を受け取り、Result 型を返す関数に加工するデコレータ */
export function resultifyValidator<T, D extends T, E>(
  validator: (arg: T) => arg is D,
  error: E
): (arg: T) => Result<D, E> {
  const { createSuccess, createFailure } = createResult<D, E>();
  return (arg: T) => (validator(arg) ? createSuccess(arg) : createFailure(error));
}
