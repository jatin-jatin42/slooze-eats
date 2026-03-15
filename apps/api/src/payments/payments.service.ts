import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, CardType } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; role: Role }) {
    // Admin sees all; others see their own
    const where = user.role === Role.ADMIN ? {} : { userId: user.id };
    return this.prisma.paymentMethod.findMany({
      where,
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async addPaymentMethod(
    userId: string,
    type: CardType,
    last4: string,
    name: string,
    user: { role: Role },
  ) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only Admins can add payment methods');
    }
    return this.prisma.paymentMethod.create({
      data: { userId, type, last4, name },
    });
  }

  async updatePaymentMethod(
    id: string,
    data: { type?: CardType; last4?: string; name?: string; isDefault?: boolean },
    user: { role: Role },
  ) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only Admins can modify payment methods');
    }
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!pm) throw new NotFoundException('Payment method not found');
    return this.prisma.paymentMethod.update({ where: { id }, data });
  }

  async deletePaymentMethod(id: string, user: { role: Role }) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only Admins can delete payment methods');
    }
    return this.prisma.paymentMethod.delete({ where: { id } });
  }
}
