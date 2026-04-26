import { Account, Transaction, User, Goal, Product, Asset } from '@mizan/shared';

export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => Promise<string | null>;
}

type PaginatedResponse<T> = {
  data?: T[];
  total?: number;
  skip?: number;
  take?: number;
  hasMore?: boolean;
};

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
    update: (data: Partial<Transaction> & { id: string }) => this.fetch<Transaction>('/api/v1/transactions', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/transactions?id=${id}`, { method: 'DELETE' }),
  };
  
  // Goals
  goals = {
    list: () => this.fetch<Goal[]>('/api/v1/goals'),
    create: (data: Partial<Goal>) => this.fetch<Goal>('/api/v1/goals', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: Partial<Goal> & { id: string }) => this.fetch<Goal>('/api/v1/goals', { method: 'PATCH', body: JSON.stringify(data) }),
    contribute: (id: string, saved: number) => this.fetch<Goal>('/api/v1/goals', { method: 'PATCH', body: JSON.stringify({ id, saved }) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/goals?id=${id}`, { method: 'DELETE' }),
  };

  // Budgets
  budgets = {
    list: () => this.fetch<any[]>('/api/v1/budgets'),
    create: (data: any) => this.fetch<any>('/api/v1/budgets', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any & { id: string }) => this.fetch<any>('/api/v1/budgets', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/budgets?id=${id}`, { method: 'DELETE' }),
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
    list: async (params?: Record<string, string>) => {
      const searchParams = new URLSearchParams({ mode: 'list', ...(params || {}) });
      const qs = `?${searchParams.toString()}`;
      const response = await this.fetch<any[] | PaginatedResponse<any>>(`/api/v1/products${qs}`);
      return Array.isArray(response) ? response : response.data ?? [];
    },
    listPage: (params?: Record<string, string>) => {
      const searchParams = new URLSearchParams({ mode: 'list', ...(params || {}) });
      const qs = `?${searchParams.toString()}`;
      return this.fetch<PaginatedResponse<any>>(`/api/v1/products${qs}`);
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
    create: (data: any) => this.fetch<any>('/api/v1/bills', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: any & { id: string }) => this.fetch<any>('/api/v1/bills', { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => this.fetch<void>(`/api/v1/bills?id=${id}`, { method: 'DELETE' }),
  };

  // Notifications
  notifications = {
    list: () => this.fetch<any[]>('/api/v1/notifications'),
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
