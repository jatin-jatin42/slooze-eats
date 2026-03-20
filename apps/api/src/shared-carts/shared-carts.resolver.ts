import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SharedCartsService } from './shared-carts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class SharedCartsResolver {
  constructor(private sharedCartsService: SharedCartsService) {}

  @Mutation(() => String)
  async createSharedCart(
    @Args('restaurantId') restaurantId: string,
    @Args('items') itemsJson: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const items = JSON.parse(itemsJson);
    const data = await this.sharedCartsService.createSharedCart(user, restaurantId, items);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async availableSharedCarts(@Context() context: any) {
    const user = context.req.user;
    const data = await this.sharedCartsService.getAvailableSharedCarts(user);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async sharedCart(@Args('id') id: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.sharedCartsService.getSharedCart(id, user);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async joinSharedCart(@Args('cartId') cartId: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.sharedCartsService.joinSharedCart(cartId, user);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async checkoutSharedCart(
    @Args('cartId') cartId: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const data = await this.sharedCartsService.checkoutSharedCart(cartId, paymentMethodId, user);
    return JSON.stringify(data);
  }
}
