import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsResolver {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    restaurants(context: any): Promise<string>;
    restaurant(id: string, context: any): Promise<string>;
    menuItems(restaurantId: string): Promise<string>;
}
