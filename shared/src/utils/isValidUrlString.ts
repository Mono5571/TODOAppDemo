export function isValidUrlString(maybeUrl: unknown): maybeUrl is string {
  if (typeof maybeUrl !== 'string') {
    console.error('invalid value on .env: CORS_ORIGIN must be a string');
    return false;
  }

  try {
    new URL(maybeUrl);

    return true;
  } catch (e) {
    const error = e instanceof Error ? e : new Error('unexpected error occurred on reading .env variable: CORS_ORIGIN');
    console.error(error);
    return false;
  }
}
