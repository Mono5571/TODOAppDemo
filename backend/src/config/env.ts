import { isValidUrlString } from '@todo/shared';

const port = Number(process.env['PORT']);
const corsOrigin = process.env['CORS_ORIGIN'];

if (!Number.isInteger(port) || port < 1 || 65535 < port) {
  throw new Error('PORT must be a valid port number');
}

if (!isValidUrlString(corsOrigin)) {
  throw new Error('CORS_ORIGIN must be a valid cors origin');
}

export const PORT = port;
export const CORS_ORIGIN = corsOrigin;
