import { OrdersService } from './orders.service';
export declare class OrdersResolver {
    private ordersService;
    constructor(ordersService: OrdersService);
    orders(context: any): Promise<string>;
    order(id: string, context: any): Promise<string>;
    createOrder(restaurantId: string, itemsJson: string, context: any): Promise<string>;
    checkoutOrder(orderId: string, paymentMethodId: string, context: any): Promise<string>;
    cancelOrder(orderId: string, context: any): Promise<string>;
}
