interface UserApiResponse<T = any> {
  success: boolean;
  user?: T;
  sessions?: any[];
  activities?: any[];
  error?: string;
}

class UserApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getProfile(userId: string): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/profile`);
  }

  async updateProfile(userId: string, updates: any): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/password`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleMfa(
    userId: string,
    data: { enabled: boolean; method?: string }
  ): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/mfa`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessions(userId: string): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/sessions`);
  }

  async revokeSession(userId: string, sessionId: string): Promise<UserApiResponse> {
    return this.request<UserApiResponse>(`/users/${userId}/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async getActivity(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<UserApiResponse> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    const endpoint = `/users/${userId}/activity${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<UserApiResponse>(endpoint);
  }
}

export const userApiService = new UserApiService();
