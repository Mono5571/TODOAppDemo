import type { Success } from '../types/result.js';
import { createResult } from './createResult.js';

// --- 必要な下準備 ---
/*
1. boolean を返すような関数を 2. のようなラッパー関数に包む
2. <Data> 型の入力を受け取り加工 -> 1.の関数に渡して戻り値が false の時に Error をなげるような関数をつくる
3. 下で定義するような onRailway の中で実行する
*/

/**
 * 戻り値を返し、副作用のない関数を Result を返すように変換する、 Railway Pattern のための高階関数
 * @param fn \<Data\> と任意の引数群を受け取って \<Data\> 型の戻り値を返す **throwable** な関数
 * @returns \<Data\> の代わりに Result を返す fn
 */
const onRailway =
  <Data, Args extends unknown[]>(fn: (data: Data, ...args: Args) => Data) =>
  (prevSuccess: Success<Data>, ...args: Args) => {
    const { createSuccess, createFailure } = createResult<Data, Error>();

    try {
      const currentData = fn(prevSuccess.data, ...args);
      return createSuccess(currentData);
    } catch (error) {
      if (error instanceof Error) {
        return createFailure(error);
      }
      return createFailure(new Error('Unknown error occurred'));
    }
  };
