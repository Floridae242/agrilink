const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const IS_PRODUCTION = import.meta.env.PROD || window.location.hostname !== 'localhost';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

// Mock data for production
const MOCK_USERS = {
  'farmer@agrilink.local': {
    id: '1',
    email: 'farmer@agrilink.local',
    name: 'John Farmer',
    role: 'FARMER',
    createdAt: '2024-01-01T00:00:00Z'
  },
  'buyer@agrilink.local': {
    id: '2',
    email: 'buyer@agrilink.local',
    name: 'Jane Buyer',
    role: 'BUYER',
    createdAt: '2024-01-01T00:00:00Z'
  },
  'inspector@agrilink.local': {
    id: '3',
    email: 'inspector@agrilink.local',
    name: 'Mike Inspector',
    role: 'INSPECTOR',
    createdAt: '2024-01-01T00:00:00Z'
  },
  'admin@agrilink.local': {
    id: '4',
    email: 'admin@agrilink.local',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: '2024-01-01T00:00:00Z'
  }
};

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.mockDelay(300); // Simulate network delay

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Handle authentication endpoints
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email, password } = body;
      if (email && password === 'password123' && MOCK_USERS[email as keyof typeof MOCK_USERS]) {
        const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
        const response: AuthResponse = {
          user,
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        };
        return response as T;
      } else {
        throw new Error('Invalid email or password');
      }
    }

    if (endpoint === '/auth/me' && method === 'GET') {
      if (!this.accessToken) {
        throw new Error('Unauthorized');
      }
      // Return the first user as a demo
      const user = Object.values(MOCK_USERS)[0];
      return { user } as T;
    }

    if (endpoint === '/auth/logout' && method === 'POST') {
      return { message: 'Logged out successfully' } as T;
    }

    // Handle public lot endpoint
    if (endpoint.startsWith('/public/lot/') && method === 'GET') {
      const publicId = endpoint.split('/').pop();
      const mockLot = {
        id: 'mock-lot-' + publicId,
        publicId: publicId,
        produce: 'Longan',
        farm: {
          name: 'Green Valley Farm',
          district: 'Chiang Mai'
        },
        events: [
          {
            id: '1',
            type: 'temperature',
            temp: 23.5,
            hum: 65,
            at: new Date(Date.now() - 3600000).toISOString(),
            place: 'Storage',
            note: 'Temperature normal'
          },
          {
            id: '2', 
            type: 'temperature',
            temp: 24.1,
            hum: 63,
            at: new Date(Date.now() - 1800000).toISOString(),
            place: 'Storage',
            note: 'Slight temperature increase'
          },
          {
            id: '3',
            type: 'temperature',
            temp: 22.8,
            hum: 67,
            at: new Date().toISOString(),
            place: 'Storage',
            note: 'Temperature optimal'
          }
        ]
      };
      return mockLot as T;
    }

    // Mock other endpoints with empty responses
    return {} as T;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Use mock API in production
    if (IS_PRODUCTION) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if we have a token
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token refresh for 401 errors
    if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
      try {
        await this.refreshAccessToken();
        // Retry the original request with new token
        headers.Authorization = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return retryResponse.json();
      } catch (refreshError) {
        // Refresh failed, clear tokens and throw error
        this.clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Network error occurred'
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.makeRequest<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    this.setTokens(response.accessToken, response.refreshToken);
  }

  // Auth methods
  async register(data: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      } catch (error) {
        // Ignore logout errors, still clear local tokens
        console.warn('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.makeRequest<{ user: User }>('/auth/me');
  }

  // API methods
  async getFarms(): Promise<any[]> {
    return this.makeRequest<any[]>('/farms');
  }

  async createLot(data: { farmId: string; produce: string }): Promise<any> {
    return this.makeRequest<any>('/lots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLotEvents(lotId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/lots/${lotId}/events`);
  }

  async createLotEvent(lotId: string, data: any): Promise<any> {
    return this.makeRequest<any>(`/lots/${lotId}/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPublicLot(publicId: string): Promise<any> {
    return this.makeRequest<any>(`/public/lot/${publicId}`);
  }

  async submitPilotRequest(data: any): Promise<{ ok: boolean }> {
    return this.makeRequest<{ ok: boolean }>('/pilot', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Export singleton instance
export const api = new ApiClient();