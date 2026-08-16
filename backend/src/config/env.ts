const port = Number(process.env['PORT']);
const portClient = Number(process.env['PORT_CLIENT']);

if (!Number.isInteger(port) || port < 1 || 65535 < port) {
  throw new Error('PORT must be a valid port number');
}

if (!Number.isInteger(portClient) || portClient < 1 || 65535 < portClient) {
  throw new Error('PORT_CLIENT must be a valid port number');
}

export const PORT = port;
export const PORT_CLIENT = portClient;
