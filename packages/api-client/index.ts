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
  
  // Goals
  goals = {
    list: () => this.fetch<Goal[]>('/api/v1/goals'),
    create: (data: Partial<Goal>) => this.fetch<Goal>('/api/v1/goals', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Budgets
  budgets = {
    list: () => this.fetch<any[]>('/api/v1/budgets'),
  };

  // Assets
  assets = {
    list: () => this.fetch<Asset[]>('/api/v1/assets'),
    create: (data: Partial<Asset>) => this.fetch<Asset>('/api/v1/assets', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Providers
  providers = {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.fetch<any[]>(`/api/v1/providers${qs}`);
    },
    get: (slug: string) => this.fetch<any>(`/api/v1/providers/${slug}`),
  };

  // Product Types (Taxonomy)
  productTypes = {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.fetch<any[]>(`/api/v1/product-types${qs}`);
    },
  };

  // Tags
  tags = {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.fetch<any[]>(`/api/v1/tags${qs}`);
    },
  };

  // Products
  products = {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.fetch<any[]>(`/api/v1/products${qs}`);
    },
    get: (id: string) => this.fetch<any>(`/api/v1/products/${id}`),
    bookmark: (id: string, method: 'POST' | 'DELETE') => this.fetch<any>(`/api/v1/products/${id}/bookmark`, { method }),
    apply: (id: string) => this.fetch<any>(`/api/v1/products/${id}/apply`, { method: 'POST' }),
    review: (id: string, data: { rating: number; comment?: string }) => 
      this.fetch<any>(`/api/v1/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  };

  // Account Links
  accountLinks = {
    list: () => this.fetch<any[]>('/api/v1/account-links'),
    create: (data: any) => this.fetch<any>('/api/v1/account-links', { method: 'POST', body: JSON.stringify(data) }),
  };


  // Bills
  bills = {
    list: () => this.fetch<any[]>('/api/v1/bills'),
  };

  // Score
  score = {
    get: () => this.fetch<any>('/api/v1/score'),
  };

  // Profile
  profile = {
    get: () => this.fetch<User>('/api/v1/profile'),
    update: (data: Partial<User>) => this.fetch<User>('/api/v1/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  };

  // Settings
  settings = {
    get: () => this.fetch<any>('/api/v1/settings'),
  };
}
