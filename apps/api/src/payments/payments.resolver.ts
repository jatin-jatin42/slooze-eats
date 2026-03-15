import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => String)
  async paymentMethods(@Context() context: any) {
    const user = context.req.user;
    const data = await this.paymentsService.findAll(user);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async addPaymentMethod(
    @Args('userId') userId: string,
    @Args('type') type: string,
    @Args('last4') last4: string,
    @Args('name') name: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const data = await this.paymentsService.addPaymentMethod(
      userId,
      type as any,
      last4,
      name,
      user,
    );
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('data') dataJson: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const data = JSON.parse(dataJson);
    const result = await this.paymentsService.updatePaymentMethod(id, data, user);
    return JSON.stringify(result);
  }

  @Mutation(() => String)
  async deletePaymentMethod(@Args('id') id: string, @Context() context: any) {
    const user = context.req.user;
    const result = await this.paymentsService.deletePaymentMethod(id, user);
    return JSON.stringify(result);
  }
}
