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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user) {
        const where = user.role === client_1.Role.ADMIN ? {} : { userId: user.id };
        return this.prisma.order.findMany({
            where,
            include: {
                items: { include: { menuItem: true } },
                restaurant: true,
                paymentMethod: true,
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, user) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { menuItem: true } },
                restaurant: true,
                paymentMethod: true,
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (user.role !== client_1.Role.ADMIN && order.userId !== user.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    async createOrder(userId, restaurantId, items) {
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: items.map((i) => i.menuItemId) } },
        });
        const orderItems = items.map((item) => {
            const mi = menuItems.find((m) => m.id === item.menuItemId);
            if (!mi)
                throw new common_1.NotFoundException(`MenuItem ${item.menuItemId} not found`);
            return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: mi.price * item.quantity,
            };
        });
        const total = orderItems.reduce((sum, i) => sum + i.price, 0);
        return this.prisma.order.create({
            data: {
                userId,
                restaurantId,
                totalAmount: total,
                items: { create: orderItems },
            },
            include: {
                items: { include: { menuItem: true } },
                restaurant: true,
            },
        });
    }
    async checkoutOrder(orderId, paymentMethodId, user) {
        if (user.role === client_1.Role.MEMBER) {
            throw new common_1.ForbiddenException('Members cannot checkout orders');
        }
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.ForbiddenException(`Order is already ${order.status}`);
        }
        const pm = await this.prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId },
        });
        if (!pm)
            throw new common_1.NotFoundException('Payment method not found');
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.CONFIRMED, paymentMethodId },
            include: {
                items: { include: { menuItem: true } },
                restaurant: true,
                paymentMethod: true,
            },
        });
    }
    async cancelOrder(orderId, user) {
        if (user.role === client_1.Role.MEMBER) {
            throw new common_1.ForbiddenException('Members cannot cancel orders');
        }
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.ForbiddenException('Order is already cancelled');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.CANCELLED },
            include: {
                items: { include: { menuItem: true } },
                restaurant: true,
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map