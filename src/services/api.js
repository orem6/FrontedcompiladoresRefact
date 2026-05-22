const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API_PREFIX = `${BASE_URL}/compiler`;

async function request(url, options = {}) {
  const { headers: customHeaders, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...customHeaders },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.message || `HTTP ${res.status}: ${res.statusText}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

export function checkHealth() {
  return request(`${API_PREFIX}/health`);
}

export function getDialects() {
  return request(`${API_PREFIX}/dialects`);
}

export function analyzeLexicalSyntax({ sql, dialect, mode = 'LEXICAL_SYNTAX', targetCollection = null, options = {} }) {
  return request(`${API_PREFIX}/analyze/lexical-syntax`, {
    method: 'POST',
    body: JSON.stringify({
      requestId: crypto.randomUUID?.() || `REQ-${Date.now()}`,
      dialect,
      sql,
      analysisMode: mode,
      targetCollection,
      options: {
        includeCommentsAsTokens: true,
        validateSemantic: false,
        stopOnLexicalError: true,
        stopOnSyntaxError: true,
        returnTokenList: true,
        returnConsoleOutput: true,
        ...options,
      },
    }),
  });
}

export function analyzeFull({ sql, dialect, connectionConfig, targetCollection = null, options = {} }) {
  return request(`${API_PREFIX}/analyze/full`, {
    method: 'POST',
    body: JSON.stringify({
      requestId: crypto.randomUUID?.() || `REQ-${Date.now()}`,
      dialect,
      sql,
      analysisMode: 'FULL',
      targetCollection,
      connectionConfig,
      options: {
        includeCommentsAsTokens: true,
        validateSemantic: true,
        stopOnLexicalError: true,
        stopOnSyntaxError: true,
        returnTokenList: true,
        returnConsoleOutput: true,
        ...options,
      },
    }),
  });
}

export function validateConnection(config) {
  return request(`${API_PREFIX}/connection/validate`, {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
