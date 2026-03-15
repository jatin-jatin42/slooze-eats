import { OrdersService } from './orders.service';
export declare class OrdersResolver {
    private ordersService;
    constructor(ordersService: OrdersService);
    orders(context: any): unknown;
    order(id: string, context: any): unknown;
    createOrder(restaurantId: string, itemsJson: string, context: any): unknown;
    checkoutOrder(orderId: string, paymentMethodId: string, context: any): unknown;
    cancelOrder(orderId: string, context: any): unknown;
}
