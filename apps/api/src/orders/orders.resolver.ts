import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => String)
  async orders(@Context() context: any) {
    const user = context.req.user;
    const data = await this.ordersService.findAll(user);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async order(@Args('id') id: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.ordersService.findOne(id, user);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async createOrder(
    @Args('restaurantId') restaurantId: string,
    @Args('items') itemsJson: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const items = JSON.parse(itemsJson);
    const data = await this.ordersService.createOrder(user.id, restaurantId, items);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async checkoutOrder(
    @Args('orderId') orderId: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const data = await this.ordersService.checkoutOrder(orderId, paymentMethodId, user);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async cancelOrder(@Args('orderId') orderId: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.ordersService.cancelOrder(orderId, user);
    return JSON.stringify(data);
  }
}
