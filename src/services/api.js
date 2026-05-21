const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API_PREFIX = `${BASE_URL}/compiler`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export function checkHealth() {
  return request(`${API_PREFIX}/health`);
}

export function getDialects() {
  return request(`${API_PREFIX}/dialects`);
}

export function analyzeLexicalSyntax(sql, dialect, mode = 'LEXICAL_SYNTAX', options = {}) {
  return request(`${API_PREFIX}/analyze/lexical-syntax`, {
    method: 'POST',
    body: JSON.stringify({
      dialect,
      sql,
      analysisMode: mode,
      options: {
        includeCommentsAsTokens: true,
        stopOnLexicalError: true,
        stopOnSyntaxError: true,
        returnTokenList: true,
        returnConsoleOutput: true,
        ...options,
      },
    }),
  });
}

export function analyzeFull(sql, dialect, connectionConfig, options = {}) {
  return request(`${API_PREFIX}/analyze/full`, {
    method: 'POST',
    body: JSON.stringify({
      dialect,
      sql,
      analysisMode: 'FULL',
      connectionConfig,
      options: {
        includeCommentsAsTokens: true,
        stopOnLexicalError: true,
        stopOnSyntaxError: true,
        returnTokenList: true,
        returnConsoleOutput: true,
        ...options,
      },
    }),
  });
}

export function testConnection(config) {
  return request(`${API_PREFIX}/connection/test`, {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
