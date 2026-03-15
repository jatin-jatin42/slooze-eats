import { PaymentsService } from './payments.service';
export declare class PaymentsResolver {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    paymentMethods(context: any): Promise<string>;
    addPaymentMethod(userId: string, type: string, last4: string, name: string, context: any): Promise<string>;
    updatePaymentMethod(id: string, dataJson: string, context: any): Promise<string>;
    deletePaymentMethod(id: string, context: any): Promise<string>;
}
