import { PrismaService } from '../prisma/prisma.service';
import { Role, CardType } from '@prisma/client';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        id: string;
        role: Role;
    }): unknown;
    addPaymentMethod(userId: string, type: CardType, last4: string, name: string, user: {
        role: Role;
    }): unknown;
    updatePaymentMethod(id: string, data: {
        type?: CardType;
        last4?: string;
        name?: string;
        isDefault?: boolean;
    }, user: {
        role: Role;
    }): unknown;
    deletePaymentMethod(id: string, user: {
        role: Role;
    }): unknown;
}
