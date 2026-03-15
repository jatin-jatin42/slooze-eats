import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        id: string;
        role: Role;
        country: Country;
    }): unknown;
    findOne(id: string, user: {
        id: string;
        role: Role;
    }): unknown;
    createOrder(user: {
        id: string;
        role: Role;
        country: Country;
    }, restaurantId: string, items: {
        menuItemId: string;
        quantity: number;
    }[]): unknown;
    checkoutOrder(orderId: string, paymentMethodId: string, user: {
        id: string;
        role: Role;
    }): unknown;
    cancelOrder(orderId: string, user: {
        id: string;
        role: Role;
    }): unknown;
}
