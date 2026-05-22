import React from 'react'; // eslint-disable-line no-unused-vars
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultTabs from './ResultTabs';

const baseResponse = {
  console: ['ok'],
  lexicalResult: { tokens: [{ type: 'IDENTIFIER', lexeme: 'db', line: 1, column: 1, dialect: 'MONGODB' }], errors: [] },
  syntaxResult: { errors: [] },
  semanticResult: { valid: true, message: 'ok', errors: [], warnings: [], validatedObjects: {} },
  errors: [],
};

describe('ResultTabs', () => {
  it('renders tokens', () => {
    render(<ResultTabs response={baseResponse} loading={false} />);
    fireEvent.click(screen.getByText('Tokens'));
    expect(screen.getByText('IDENTIFIER')).toBeInTheDocument();
  });

  it('renders errors', () => {
    render(<ResultTabs response={{ ...baseResponse, lexicalResult: { ...baseResponse.lexicalResult, errors: [{ code: 'E1', message: 'err', severity: 'ERROR' }] } }} loading={false} />);
    fireEvent.click(screen.getByText('Errores'));
    expect(screen.getByText('E1')).toBeInTheDocument();
  });

  it('renders warning string', () => {
    render(<ResultTabs response={{ ...baseResponse, semanticResult: { ...baseResponse.semanticResult, warnings: ['warn text'] } }} loading={false} />);
    fireEvent.click(screen.getByText('Semantico'));
    expect(screen.getByText('warn text')).toBeInTheDocument();
  });

  it('renders warning object', () => {
    render(<ResultTabs response={{ ...baseResponse, semanticResult: { ...baseResponse.semanticResult, warnings: [{ code: 'W1', message: 'obj warn', severity: 'WARNING' }] } }} loading={false} />);
    fireEvent.click(screen.getByText('Semantico'));
    expect(screen.getByText('obj warn')).toBeInTheDocument();
  });

  it('renders validatedObjects for MongoDB', () => {
    render(<ResultTabs response={{ ...baseResponse, semanticResult: { ...baseResponse.semanticResult, validatedObjects: { collections: [{ name: 'orders', exists: true }] } } }} loading={false} />);
    fireEvent.click(screen.getByText('Semantico'));
    expect(screen.getByText('collections')).toBeInTheDocument();
    expect(screen.getByText('orders')).toBeInTheDocument();
  });

  it('renders validatedObjects for Cassandra', () => {
    render(<ResultTabs response={{ ...baseResponse, semanticResult: { ...baseResponse.semanticResult, validatedObjects: { keyspaces: [{ name: 'demo', exists: true }], rules: ['ALLOW FILTERING warning'] } } }} loading={false} />);
    fireEvent.click(screen.getByText('Semantico'));
    expect(screen.getByText('keyspaces')).toBeInTheDocument();
    expect(screen.getByText('rules')).toBeInTheDocument();
  });
});
