import type { Result, Validator } from '@todo/shared';
import type { ApiClient } from './types/ApiClient.js';
import type { ApiClientDependencies } from './types/ApiClientDependencies.js';

export function createApiClient(deps: ApiClientDependencies): ApiClient {
  const request = async <T>(
    path: string, // e.g. '/todos'
    toData: (res: Response) => Promise<unknown> | undefined,
    validate: Validator<T>,
    init?: RequestInit
  ): Promise<Result<T, Error>> => {
    try {
      const headers = new Headers(init?.headers);

      // headers.set('Authorization', `${await deps.jwtProvider()}`);

      if (init?.body !== undefined) {
        headers.set('Content-Type', 'application/json; charset=utf-8');
      }

      const res = await deps.fetchClient(`${deps.apiBaseUrl}${path}`, {
        ...init,
        headers
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await toData(res);
      if (!validate(data)) throw new Error('INTERNAL_ERROR');

      return { ok: true, data };
    } catch (e) {
      return { ok: false, err: e instanceof Error ? e : new Error('unknown error occurred') };
    }
  };

  const resToUnknown = (res: Response): Promise<unknown> => res.json();

  return {
    get: <T>(path: string, validate: Validator<T>) => request<T>(path, resToUnknown, validate, { method: 'GET' }),
    post: <T>(path: string, body: unknown, validate: Validator<T>) =>
      request<T>(path, resToUnknown, validate, { method: 'POST', body: JSON.stringify(body) }),
    patch: (path: string, body: unknown) =>
      request<void>(
        path,
        () => undefined,
        (data) => data === undefined,
        { method: 'PATCH', body: JSON.stringify(body) }
      ),
    remove: (path: string) =>
      request<void>(
        path,
        () => undefined,
        (data) => data === undefined,
        { method: 'DELETE' }
      ),
    put: <T>(path: string, body: unknown, validate: Validator<T>) =>
      request(path, resToUnknown, validate, { method: 'PUT', body: JSON.stringify(body) })
  };
}
