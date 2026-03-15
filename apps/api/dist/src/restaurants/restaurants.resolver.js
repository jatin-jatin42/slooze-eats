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
exports.RestaurantsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const restaurants_service_1 = require("./restaurants.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RestaurantsResolver = class RestaurantsResolver {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async restaurants(context) {
        const user = context.req.user;
        const data = await this.restaurantsService.findAll(user);
        return JSON.stringify(data);
    }
    async restaurant(id, context) {
        const user = context.req.user;
        const data = await this.restaurantsService.findOne(id, user);
        return JSON.stringify(data);
    }
    async menuItems(restaurantId, context) {
        const user = context.req.user;
        const data = await this.restaurantsService.findMenuItems(restaurantId, user);
        return JSON.stringify(data);
    }
};
exports.RestaurantsResolver = RestaurantsResolver;
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "restaurants", null);
__decorate([
    (0, graphql_1.Query)(() => String, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "restaurant", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)('restaurantId')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "menuItems", null);
exports.RestaurantsResolver = RestaurantsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsResolver);
//# sourceMappingURL=restaurants.resolver.js.map