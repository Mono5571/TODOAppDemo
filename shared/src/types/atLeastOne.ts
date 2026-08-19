/**
 * @template T 元になる型
 * @template U 型定義のためのデフォルト型引数。使用時には **指定しない**
 *
 * @description { [key]: value } 形式のオブジェクトに対し、
 * すべてのプロパティを任意にしたうえで、空のオブジェクトを受け入れない型をつくる
 */
export type AtLeastOne<T extends object, U = { [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>> }> = T extends unknown[]
  ? never
  : U[keyof U];
