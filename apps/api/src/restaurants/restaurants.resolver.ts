import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  @Query(() => String)
  async restaurants(@Context() context: any) {
    const user = context.req.user;
    const data = await this.restaurantsService.findAll(user);
    return JSON.stringify(data);
  }

  @Query(() => String, { nullable: true })
  async restaurant(@Args('id') id: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.restaurantsService.findOne(id, user);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async menuItems(@Args('restaurantId') restaurantId: string, @Context() context: any) {
    const user = context.req.user;
    const data = await this.restaurantsService.findMenuItems(restaurantId, user);
    return JSON.stringify(data);
  }
}
