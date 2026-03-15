"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaymentsResolver = class PaymentsResolver {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async paymentMethods(context) {
        const user = context.req.user;
        const data = await this.paymentsService.findAll(user);
        return JSON.stringify(data);
    }
    async addPaymentMethod(userId, type, last4, name, context) {
        const user = context.req.user;
        const data = await this.paymentsService.addPaymentMethod(userId, type, last4, name, user);
        return JSON.stringify(data);
    }
    async updatePaymentMethod(id, dataJson, context) {
        const user = context.req.user;
        const data = JSON.parse(dataJson);
        const result = await this.paymentsService.updatePaymentMethod(id, data, user);
        return JSON.stringify(result);
    }
    async deletePaymentMethod(id, context) {
        const user = context.req.user;
        const result = await this.paymentsService.deletePaymentMethod(id, user);
        return JSON.stringify(result);
    }
};
exports.PaymentsResolver = PaymentsResolver;
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "paymentMethods", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('type')),
    __param(2, (0, graphql_1.Args)('last4')),
    __param(3, (0, graphql_1.Args)('name')),
    __param(4, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "addPaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('data')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "updatePaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "deletePaymentMethod", null);
exports.PaymentsResolver = PaymentsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolver);
//# sourceMappingURL=payments.resolver.js.map