import { Account, Transaction, User, Goal, Product, Asset } from '@mizan/shared';

export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => Promise<string | null>;
}

export class MizanAPI {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await this.config.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.config.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // Dashboard
  dashboard = {
    get: () => this.fetch<any>('/api/v1/dashboard'),
  };

  // Accounts
  accounts = {
    list: () => this.fetch<Account[]>('/api/v1/accounts'),
    create: (data: Partial<Account>) => this.fetch<Account>('/api/v1/accounts', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: Partial<Account> & { id: string }) => this.fetch<Account>('/api/v1/accounts', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/accounts?id=${id}`, { method: 'DELETE' }),
  };

  // Transactions
  transactions = {
    list: () => this.fetch<Transaction[]>('/api/v1/transactions'),
    create: (data: Partial<Transaction>) => this.fetch<Transaction>('/api/v1/transactions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/transactions?id=${id}`, { method: 'DELETE' }),
  };
  
  // Expose additional endpoints...
}
