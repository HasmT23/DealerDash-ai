export interface IAuthService {
    signUp(email: string, password: string, userData: object): Promise<string>;
    signIn(email: string, password: string): Promise<string>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<object | null>;
    updateUserProfile(userId: string, data: object): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
    verifyEmail(email: string): Promise<boolean>;
  }