import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '@prisma/client';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: {
        role: Role;
        country: Country;
    }): unknown;
    findOne(id: string, user: {
        role: Role;
        country: Country;
    }): unknown;
    findMenuItems(restaurantId: string, user: {
        role: Role;
        country: Country;
    }): unknown;
}
