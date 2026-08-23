import { isValidUrlString } from '@todo/shared';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!isValidUrlString(apiBaseUrl)) {
  throw new Error('');
}

export const env = {
  apiBaseUrl
};
