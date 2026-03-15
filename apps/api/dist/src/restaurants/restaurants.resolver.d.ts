import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsResolver {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    restaurants(context: any): unknown;
    restaurant(id: string, context: any): unknown;
    menuItems(restaurantId: string, context: any): unknown;
}
