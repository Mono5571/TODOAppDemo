const port = Number(process.env['PORT']);

if (!Number.isInteger(port) || port < 1 || 65535 < port) {
  throw new Error('PORT must be a valid port number');
}

export const PORT = port;
