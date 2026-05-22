import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateConnection, analyzeLexicalSyntax, analyzeFull } from './api';

describe('api services', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ valid: true }),
    });
  });

  it('validateConnection uses /connection/validate', async () => {
    await validateConnection({ dialect: 'MYSQL' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/compiler/connection/validate'), expect.any(Object));
  });

  it('validateConnection does not use /connection/test', async () => {
    await validateConnection({ dialect: 'MYSQL' });
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining('/connection/test'), expect.any(Object));
  });

  it('analyzeLexicalSyntax sends LEXICAL_SYNTAX mode', async () => {
    await analyzeLexicalSyntax({ sql: 'SELECT 1', dialect: 'MYSQL' });
    const [, options] = fetch.mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(payload.analysisMode).toBe('LEXICAL_SYNTAX');
  });

  it('analyzeFull sends FULL mode', async () => {
    await analyzeFull({ sql: 'SELECT 1', dialect: 'MYSQL', connectionConfig: { dialect: 'MYSQL' } });
    const [, options] = fetch.mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(payload.analysisMode).toBe('FULL');
  });

  it('analyzeFull includes connectionConfig', async () => {
    const connectionConfig = { dialect: 'MONGODB', host: 'localhost', port: 27017 };
    await analyzeFull({ sql: 'db.a.find({})', dialect: 'MONGODB', connectionConfig });
    const [, options] = fetch.mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(payload.connectionConfig).toEqual(connectionConfig);
  });

  it('analyzeFull includes targetCollection when provided', async () => {
    await analyzeFull({
      sql: '[{"$match":{}}]',
      dialect: 'MONGODB',
      connectionConfig: { dialect: 'MONGODB' },
      targetCollection: 'orders',
    });
    const [, options] = fetch.mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(payload.targetCollection).toBe('orders');
  });
});
