import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        id: string;
        role: Role;
        country: Country;
    }): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        paymentMethod: {
            id: string;
            name: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.CardType;
            last4: string;
            isDefault: boolean;
            userId: string;
        } | null;
        restaurant: {
            id: string;
            name: string;
            country: import("@prisma/client").$Enums.Country;
            cuisine: string;
            image: string | null;
            rating: number;
        };
        items: ({
            menuItem: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: number;
                category: string;
                restaurantId: string;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        restaurantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        updatedAt: Date;
        paymentMethodId: string | null;
    })[]>;
    findOne(id: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        paymentMethod: {
            id: string;
            name: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.CardType;
            last4: string;
            isDefault: boolean;
            userId: string;
        } | null;
        restaurant: {
            id: string;
            name: string;
            country: import("@prisma/client").$Enums.Country;
            cuisine: string;
            image: string | null;
            rating: number;
        };
        items: ({
            menuItem: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: number;
                category: string;
                restaurantId: string;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        restaurantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        updatedAt: Date;
        paymentMethodId: string | null;
    }>;
    createOrder(user: {
        id: string;
        role: Role;
        country: Country;
    }, restaurantId: string, items: {
        menuItemId: string;
        quantity: number;
    }[]): Promise<{
        restaurant: {
            id: string;
            name: string;
            country: import("@prisma/client").$Enums.Country;
            cuisine: string;
            image: string | null;
            rating: number;
        };
        items: ({
            menuItem: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: number;
                category: string;
                restaurantId: string;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        restaurantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        updatedAt: Date;
        paymentMethodId: string | null;
    }>;
    checkoutOrder(orderId: string, paymentMethodId: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        paymentMethod: {
            id: string;
            name: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.CardType;
            last4: string;
            isDefault: boolean;
            userId: string;
        } | null;
        restaurant: {
            id: string;
            name: string;
            country: import("@prisma/client").$Enums.Country;
            cuisine: string;
            image: string | null;
            rating: number;
        };
        items: ({
            menuItem: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: number;
                category: string;
                restaurantId: string;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        restaurantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        updatedAt: Date;
        paymentMethodId: string | null;
    }>;
    cancelOrder(orderId: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        restaurant: {
            id: string;
            name: string;
            country: import("@prisma/client").$Enums.Country;
            cuisine: string;
            image: string | null;
            rating: number;
        };
        items: ({
            menuItem: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: number;
                category: string;
                restaurantId: string;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        restaurantId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        updatedAt: Date;
        paymentMethodId: string | null;
    }>;
}
