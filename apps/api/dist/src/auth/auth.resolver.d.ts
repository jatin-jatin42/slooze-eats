import { AuthService } from './auth.service';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(email: string, password: string, context: any): unknown;
    logout(context: any): unknown;
    me(context: any): unknown;
}
