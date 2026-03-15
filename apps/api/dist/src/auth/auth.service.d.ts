import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            country: import("@prisma/client").$Enums.Country;
        };
    }>;
    getMe(userId: string): Promise<({
        paymentMethods: {
            id: string;
            name: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.CardType;
            last4: string;
            isDefault: boolean;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        country: import("@prisma/client").$Enums.Country;
        createdAt: Date;
    }) | null>;
}
