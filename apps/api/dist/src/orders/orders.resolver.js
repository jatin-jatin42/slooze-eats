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
exports.OrdersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let OrdersResolver = class OrdersResolver {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async orders(context) {
        const user = context.req.user;
        const data = await this.ordersService.findAll(user);
        return JSON.stringify(data);
    }
    async order(id, context) {
        const user = context.req.user;
        const data = await this.ordersService.findOne(id, user);
        return JSON.stringify(data);
    }
    async createOrder(restaurantId, itemsJson, context) {
        const user = context.req.user;
        const items = JSON.parse(itemsJson);
        const data = await this.ordersService.createOrder(user, restaurantId, items);
        return JSON.stringify(data);
    }
    async checkoutOrder(orderId, paymentMethodId, context) {
        const user = context.req.user;
        const data = await this.ordersService.checkoutOrder(orderId, paymentMethodId, user);
        return JSON.stringify(data);
    }
    async cancelOrder(orderId, context) {
        const user = context.req.user;
        const data = await this.ordersService.cancelOrder(orderId, user);
        return JSON.stringify(data);
    }
};
exports.OrdersResolver = OrdersResolver;
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "orders", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "order", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('restaurantId')),
    __param(1, (0, graphql_1.Args)('items')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "createOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('orderId')),
    __param(1, (0, graphql_1.Args)('paymentMethodId')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "checkoutOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('orderId')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "cancelOrder", null);
exports.OrdersResolver = OrdersResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersResolver);
//# sourceMappingURL=orders.resolver.js.map