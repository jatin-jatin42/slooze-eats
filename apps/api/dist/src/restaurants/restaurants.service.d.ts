import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '@prisma/client';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        role: Role;
        country: Country;
    }): Promise<({
        menuItems: {
            id: string;
            name: string;
            image: string | null;
            description: string | null;
            price: number;
            category: string;
            restaurantId: string;
        }[];
    } & {
        id: string;
        name: string;
        country: import("@prisma/client").$Enums.Country;
        cuisine: string;
        image: string | null;
        rating: number;
    })[]>;
    findOne(id: string, user: {
        role: Role;
        country: Country;
    }): Promise<({
        menuItems: {
            id: string;
            name: string;
            image: string | null;
            description: string | null;
            price: number;
            category: string;
            restaurantId: string;
        }[];
    } & {
        id: string;
        name: string;
        country: import("@prisma/client").$Enums.Country;
        cuisine: string;
        image: string | null;
        rating: number;
    }) | null>;
    findMenuItems(restaurantId: string): Promise<{
        id: string;
        name: string;
        image: string | null;
        description: string | null;
        price: number;
        category: string;
        restaurantId: string;
    }[]>;
}
