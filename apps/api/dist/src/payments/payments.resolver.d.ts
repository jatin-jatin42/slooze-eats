import { PaymentsService } from './payments.service';
export declare class PaymentsResolver {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    paymentMethods(context: any): unknown;
    addPaymentMethod(userId: string, type: string, last4: string, name: string, context: any): unknown;
    updatePaymentMethod(id: string, dataJson: string, context: any): unknown;
    deletePaymentMethod(id: string, context: any): unknown;
}
