import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: any] | [opt: any]) => InstanceType<typeof Strategy> & {
    validate(...args: any[]): unknown | Promise<unknown>;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
        country: string;
    }): unknown;
}
export {};
