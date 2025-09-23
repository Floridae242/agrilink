const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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