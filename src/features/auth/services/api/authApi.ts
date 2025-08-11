import { RegisterUserCommand } from '../../domain/entities';
import { UserAlreadyExistsError } from '../../domain/errors';

interface RegisterApiResponse {
  success: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
  };
  error?: string;
}

class AuthApiService {
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

  async register(command: RegisterUserCommand): Promise<RegisterApiResponse> {
    try {
      return await this.request<RegisterApiResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(command),
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw new UserAlreadyExistsError(command.email, 'email');
      }
      throw error;
    }
  }
}

export const authApiService = new AuthApiService();
