import { RegisterUserCommand } from '@/features/auth/domain/entities';
import { authApiService } from '@/features/auth/services/api/authApi';

class AuthBusinessService {
  async registerUser(command: RegisterUserCommand) {
    // Business validation is already done in domain/rules
    // Just proceed with API call
    const response = await authApiService.register(command);

    if (!response.success) {
      throw new Error(response.error || 'Registration failed');
    }

    return response.user;
  }
}

export const authBusinessService = new AuthBusinessService();
