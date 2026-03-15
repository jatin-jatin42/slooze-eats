import { AuthService } from './auth.service';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(email: string, password: string, context: any): Promise<string>;
    logout(context: any): Promise<boolean>;
    me(context: any): Promise<string>;
}
