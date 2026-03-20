import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role, OrderStatus } from '@prisma/client';

@Injectable()
export class SharedCartsService {
  constructor(private prisma: PrismaService) {}

  async createSharedCart(
    user: { id: string; role: Role; country: Country },
    restaurantId: string,
    items: { menuItemId: string; quantity: number }[],
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
      throw new ForbiddenException('Cannot order from a restaurant outside your country');
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Cart cannot be empty');
    }

    return this.prisma.sharedCart.create({
      data: {
        restaurantId,
        country: user.country,
        participants: {
          create: [{ userId: user.id }]
        },
        items: {
          create: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        items: { include: { menuItem: true } },
        restaurant: true,
      }
    });
  }

  async getAvailableSharedCarts(user: { id: string; role: Role; country: Country }) {
    if (user.role === Role.ADMIN) {
      return this.prisma.sharedCart.findMany({
        where: { isActive: true },
        include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } }, restaurant: true },
        orderBy: { createdAt: 'desc' }
      });
    }
    return this.prisma.sharedCart.findMany({
      where: { isActive: true, country: user.country },
      include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } }, restaurant: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSharedCart(cartId: string, user: { id: string; role: Role; country: Country }) {
    const cart = await this.prisma.sharedCart.findUnique({
      where: { id: cartId },
      include: {
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        items: { include: { menuItem: true } },
        restaurant: true,
      }
    });

    if (!cart) throw new NotFoundException('Shared cart not found');

    const isParticipant = cart.participants.some((p: any) => p.userId === user.id);
    if (!isParticipant && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not a participant in this cart');
    }

    return cart;
  }

  async joinSharedCart(cartId: string, user: { id: string; role: Role; country: Country }) {
    const cart = await this.prisma.sharedCart.findUnique({
      where: { id: cartId },
      include: { participants: true }
    });

    if (!cart) throw new NotFoundException('Shared cart not found');
    if (!cart.isActive) throw new BadRequestException('This cart has already been checked out');

    if (user.role !== Role.ADMIN && cart.country !== user.country) {
      throw new ForbiddenException(`You can only join carts from your country (${cart.country})`);
    }

    const alreadyJoined = cart.participants.some((p: any) => p.userId === user.id);
    if (alreadyJoined) {
      return this.getSharedCart(cartId, user);
    }

    await this.prisma.sharedCartParticipant.upsert({
      where: { cartId_userId: { cartId, userId: user.id } },
      create: { cartId, userId: user.id },
      update: {},
    });

    return this.getSharedCart(cartId, user);
  }

  async checkoutSharedCart(cartId: string, paymentMethodId: string, user: { id: string; role: Role; country: Country }) {
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot checkout orders');
    }

    const cart = await this.prisma.sharedCart.findUnique({
      where: { id: cartId },
      include: {
        participants: true,
        items: { include: { menuItem: true } }
      }
    });

    if (!cart) throw new NotFoundException('Shared cart not found');
    if (!cart.isActive) throw new BadRequestException('This cart has already been checked out');

    const isParticipant = cart.participants.some((p: any) => p.userId === user.id);
    if (!isParticipant && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You must join the shared cart to check out');
    }

    // Verify payment method
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (user.role !== Role.ADMIN && pm.userId !== user.id) {
      throw new ForbiddenException("Cannot use another user's payment method");
    }

    // Calculate total and order items
    let total = 0;
    const orderItemsData = cart.items.map((ci: any) => {
      const price = ci.quantity * ci.menuItem.price;
      total += price;
      return {
        menuItemId: ci.menuItemId,
        quantity: ci.quantity,
        price
      };
    });

    // Create Order and Deactivate Cart tightly inside a transaction
    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          userId: user.id, // the one paying
          restaurantId: cart.restaurantId,
          totalAmount: total,
          status: OrderStatus.CONFIRMED,
          paymentMethodId,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
          paymentMethod: true,
        }
      }),
      this.prisma.sharedCart.update({
        where: { id: cartId },
        data: { isActive: false }
      })
    ]);

    return order;
  }
}
