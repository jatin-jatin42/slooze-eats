import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
        country: string;
    }): Promise<{
        password: string;
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        country: import("@prisma/client").$Enums.Country;
        createdAt: Date;
    } | null>;
}
export {};
