export interface ApiClientDependencies {
  apiBaseUrl: string; // e.g. 'http://localhost:3000'
  fetchClient: (input: string | RequestInfo, init?: RequestInit) => Promise<Response>;
  // jwtProvider: async () => JWTToken;
  // logger
  // metrics
}
