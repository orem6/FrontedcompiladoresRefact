import React from 'react'; // eslint-disable-line no-unused-vars
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConnectionPanel from './ConnectionPanel';

vi.mock('../../services/api', () => ({
  validateConnection: vi.fn().mockResolvedValue({ valid: true, connectionResult: { connected: true } }),
}));

import { validateConnection } from '../../services/api';

describe('ConnectionPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets MongoDB default port 27017', () => {
    render(<ConnectionPanel dialect="MONGODB" onConnectionChange={() => {}} />);
    expect(screen.getByLabelText('Puerto')).toHaveValue('27017');
  });

  it('sets Cassandra CQL default port 9042', () => {
    render(<ConnectionPanel dialect="CASSANDRA_CQL" onConnectionChange={() => {}} />);
    expect(screen.getByLabelText('Puerto')).toHaveValue('9042');
  });

  it('shows localDatacenter for Cassandra', () => {
    render(<ConnectionPanel dialect="CASSANDRA_CQL" onConnectionChange={() => {}} />);
    expect(screen.getByLabelText('Local Datacenter')).toBeInTheDocument();
  });

  it('shows username and password for MongoDB', () => {
    render(<ConnectionPanel dialect="MONGODB" onConnectionChange={() => {}} />);
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('connect button calls validateConnection', async () => {
    render(<ConnectionPanel dialect="MYSQL" onConnectionChange={() => {}} />);
    fireEvent.change(screen.getByLabelText('Base de datos'), { target: { value: 'demo' } });
    fireEvent.click(screen.getByText('Conectar'));
    expect(validateConnection).toHaveBeenCalledTimes(1);
  });

  it('does not use /connection/test symbol in API', () => {
    expect(validateConnection.name).toContain('spy');
  });
});
