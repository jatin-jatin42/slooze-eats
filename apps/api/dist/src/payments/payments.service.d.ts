import { PrismaService } from '../prisma/prisma.service';
import { Role, CardType } from '@prisma/client';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        id: string;
        role: Role;
    }): Promise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.CardType;
        last4: string;
        isDefault: boolean;
        userId: string;
    })[]>;
    addPaymentMethod(userId: string, type: CardType, last4: string, name: string, user: {
        role: Role;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.CardType;
        last4: string;
        isDefault: boolean;
        userId: string;
    }>;
    updatePaymentMethod(id: string, data: {
        type?: CardType;
        last4?: string;
        name?: string;
        isDefault?: boolean;
    }, user: {
        role: Role;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.CardType;
        last4: string;
        isDefault: boolean;
        userId: string;
    }>;
    deletePaymentMethod(id: string, user: {
        role: Role;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.CardType;
        last4: string;
        isDefault: boolean;
        userId: string;
    }>;
}
