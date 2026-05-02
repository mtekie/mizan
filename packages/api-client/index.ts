import { Account, Transaction, User, Goal, Product, Asset, FindScreenApiResponse, GoalsScreenApiResponse, HomeScreenApiResponse, MoneyScreenApiResponse, NotificationsScreenApiResponse, ProfileScreenApiResponse, ScoreScreenApiResponse, ProductDetailApiResponse, ProviderDetailApiResponse, SettingsScreenDataContract, SettingsUpdateRequest } from '@mizan/shared';

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
    get: () => this.fetch<HomeScreenApiResponse>('/api/v1/dashboard'),
  };

  // Ledger / Money screen payload
  ledger = {
    get: () => this.fetch<MoneyScreenApiResponse>('/api/v1/ledger'),
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
    screen: () => this.fetch<GoalsScreenApiResponse>('/api/v1/goals-screen'),
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
    screen: (slug: string) => this.fetch<ProviderDetailApiResponse>(`/api/v1/provider-screen/${slug}`),
  };

  // Product Types (Taxonomy)
  productTypes = {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.fetch<any[]>(`/api/v1/product-types${qs}`);
    },
  };

  // Find / Catalogue screen bootstrap
  catalogue = {
    bootstrap: () => this.fetch<FindScreenApiResponse>('/api/v1/catalogue/bootstrap'),
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
    screen: (id: string) => this.fetch<ProductDetailApiResponse>(`/api/v1/product-screen/${id}`),
    bookmark: (id: string, method: 'POST' | 'DELETE') => this.fetch<any>(`/api/v1/products/${id}/bookmark`, { method }),
    apply: (id: string) => this.fetch<any>(`/api/v1/products/${id}/apply`, { method: 'POST' }),
    review: (id: string, data: { rating: number; comment?: string }) => 
      this.fetch<any>(`/api/v1/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  };

  // Settings
  settings = {
    screen: () => this.fetch<SettingsScreenDataContract>('/api/v1/settings'),
    get: () => this.fetch<SettingsScreenDataContract>('/api/v1/settings'),
    update: (data: Partial<SettingsUpdateRequest>) => this.fetch<SettingsScreenDataContract>('/api/v1/settings', { method: 'PATCH', body: JSON.stringify(data) }),
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
    screen: () => this.fetch<NotificationsScreenApiResponse>('/api/v1/notifications-screen'),
    list: () => this.fetch<any[]>('/api/v1/notifications'),
  };

  // Score
  score = {
    screen: () => this.fetch<ScoreScreenApiResponse>('/api/v1/score-screen'),
    get: () => this.fetch<any>('/api/v1/score'),
  };

  // Profile
  profile = {
    screen: () => this.fetch<ProfileScreenApiResponse>('/api/v1/profile-screen'),
    get: () => this.fetch<User>('/api/v1/profile'),
    update: (data: Partial<User>) => this.fetch<User>('/api/v1/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  };
}
