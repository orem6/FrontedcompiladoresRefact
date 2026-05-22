import React from 'react'; // eslint-disable-line no-unused-vars
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SqlEditor from './SqlEditor';

describe('SqlEditor', () => {
  it('shows official dialects', () => {
    render(<SqlEditor onAnalyze={() => {}} onClear={() => {}} onDialectChange={() => {}} targetCollection="" onTargetCollectionChange={() => {}} />);
    expect(screen.getByRole('option', { name: 'MySQL' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'PostgreSQL' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'SQL Server' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'MongoDB' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cassandra CQL' })).toBeInTheDocument();
  });

  it('shows targetCollection when MongoDB selected', () => {
    render(<SqlEditor onAnalyze={() => {}} onClear={() => {}} onDialectChange={() => {}} targetCollection="" onTargetCollectionChange={() => {}} />);
    fireEvent.change(screen.getByLabelText('Motor de base de datos'), { target: { value: 'MONGODB' } });
    expect(screen.getByLabelText('Coleccion objetivo')).toBeInTheDocument();
  });

  it('uses CASSANDRA_CQL value', () => {
    render(<SqlEditor onAnalyze={() => {}} onClear={() => {}} onDialectChange={() => {}} targetCollection="" onTargetCollectionChange={() => {}} />);
    fireEvent.change(screen.getByLabelText('Motor de base de datos'), { target: { value: 'CASSANDRA_CQL' } });
    expect(screen.getByLabelText('Motor de base de datos')).toHaveValue('CASSANDRA_CQL');
  });

  it('Ctrl+Enter executes analyze', () => {
    const onAnalyze = vi.fn();
    render(<SqlEditor onAnalyze={onAnalyze} onClear={() => {}} onDialectChange={() => {}} targetCollection="" onTargetCollectionChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', ctrlKey: true });
    expect(onAnalyze).toHaveBeenCalledTimes(1);
  });
});
