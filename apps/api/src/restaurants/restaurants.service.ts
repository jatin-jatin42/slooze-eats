import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { role: Role; country: Country }) {
    // Admin sees all; Manager/Member see their country only (Re-BAC)
    const where =
      user.role === Role.ADMIN ? {} : { country: user.country };
    return this.prisma.restaurant.findMany({
      where,
      include: { menuItems: true },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string, user: { role: Role; country: Country }) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    // Country guard for non-Admin
    if (
      restaurant &&
      user.role !== Role.ADMIN &&
      restaurant.country !== user.country
    ) {
      return null;
    }
    return restaurant;
  }

  async findMenuItems(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
    });
  }
}
