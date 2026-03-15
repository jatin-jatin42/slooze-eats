import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; role: Role; country: Country }) {
    // Admin sees all; others see only their own orders
    const where =
      user.role === Role.ADMIN ? {} : { userId: user.id };
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

  async findOne(id: string, user: { id: string; role: Role }) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
        paymentMethod: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  async createOrder(
    user: { id: string; role: Role; country: Country },
    restaurantId: string,
    items: { menuItemId: string; quantity: number }[],
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
      throw new ForbiddenException('Cannot order from a restaurant outside your country');
    }

    // Fetch menu items to compute prices
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: items.map((i) => i.menuItemId) } },
    });

    const orderItems = items.map((item) => {
      const mi = menuItems.find((m) => m.id === item.menuItemId);
      if (!mi) throw new NotFoundException(`MenuItem ${item.menuItemId} not found`);
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: mi.price * item.quantity,
      };
    });

    const total = orderItems.reduce((sum, i) => sum + i.price, 0);

    return this.prisma.order.create({
      data: {
        userId: user.id,
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

  async checkoutOrder(
    orderId: string,
    paymentMethodId: string,
    user: { id: string; role: Role },
  ) {
    // Only ADMIN and MANAGER can checkout
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot checkout orders');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('Cannot checkout another user\'s order');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException(`Order is already ${order.status}`);
    }

    // Verify payment method exists and belongs to user (or admin)
    const pm = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (user.role !== Role.ADMIN && pm.userId !== user.id) {
      throw new ForbiddenException('Cannot use another user\'s payment method');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CONFIRMED, paymentMethodId },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
        paymentMethod: true,
      },
    });
  }

  async cancelOrder(orderId: string, user: { id: string; role: Role }) {
    // Only ADMIN and MANAGER can cancel
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('Cannot cancel another user\'s order');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new ForbiddenException('Order is already cancelled');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
      include: {
        items: { include: { menuItem: true } },
        restaurant: true,
      },
    });
  }
}
