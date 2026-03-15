"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user) {
        const where = user.role === client_1.Role.ADMIN ? {} : { userId: user.id };
        return this.prisma.paymentMethod.findMany({
            where,
            include: { user: { select: { id: true, name: true } } },
        });
    }
    async addPaymentMethod(userId, type, last4, name, user) {
        if (user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only Admins can add payment methods');
        }
        return this.prisma.paymentMethod.create({
            data: { userId, type, last4, name },
        });
    }
    async updatePaymentMethod(id, data, user) {
        if (user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only Admins can modify payment methods');
        }
        const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });
        if (!pm)
            throw new common_1.NotFoundException('Payment method not found');
        return this.prisma.paymentMethod.update({ where: { id }, data });
    }
    async deletePaymentMethod(id, user) {
        if (user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only Admins can delete payment methods');
        }
        return this.prisma.paymentMethod.delete({ where: { id } });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map