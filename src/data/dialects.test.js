import { describe, it, expect } from 'vitest';
import { DIALECTS } from './mockData';

describe('DIALECTS', () => {
  const portByDialect = Object.fromEntries(DIALECTS.map((d) => [d.value, d.defaultPort]));

  it('has expected default ports', () => {
    expect(portByDialect.MYSQL).toBe('3306');
    expect(portByDialect.POSTGRESQL).toBe('5432');
    expect(portByDialect.SQL_SERVER).toBe('1433');
    expect(portByDialect.MONGODB).toBe('27017');
    expect(portByDialect.CASSANDRA_CQL).toBe('9042');
  });

  it('does not expose CASSANDRA as public value', () => {
    expect(DIALECTS.some((d) => d.value === 'CASSANDRA')).toBe(false);
  });
});
