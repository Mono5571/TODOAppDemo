import type { Result, Validator } from '@todo/shared';

export interface ApiClient {
  get: <T>(path: string, validate: Validator<T>) => Promise<Result<T, Error>>;
  post: <T>(path: string, body: unknown, validate: Validator<T>) => Promise<Result<T, Error>>;
  patch: (path: string, body: unknown) => Promise<Result<void, Error>>;
  remove: (path: string) => Promise<Result<void, Error>>;
  put: <T>(path: string, body: unknown, validate: Validator<T>) => Promise<Result<T, Error>>;
}
