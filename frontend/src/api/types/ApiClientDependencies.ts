export interface ApiClientDependencies {
  apiBaseUrl: string; // e.g. 'http://localhost:3000'
  fetchClient: typeof fetch;
  // jwtProvider: async () => JWTToken;
  // logger
  // metrics
}
