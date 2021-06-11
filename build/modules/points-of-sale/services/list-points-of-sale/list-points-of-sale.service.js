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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_of_sale_1 = __importDefault(require("../../contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../contracts/repositories/points-of-sale.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ListPointsOfSaleService = class ListPointsOfSaleService {
    constructor(pointsOfSaleRepository, usersRepository) {
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ userId, label, groupId, limit, offset, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.OWNER) {
            const response = await this.pointsOfSaleRepository.find({
                by: 'ownerId',
                value: user.id,
                filters: {
                    groupId,
                    limit,
                    label,
                    offset,
                },
            });
            return response;
        }
        if (user.groupIds) {
            const response = await this.pointsOfSaleRepository.find({
                by: 'groupId',
                value: groupId || user.groupIds,
                filters: {
                    label,
                    limit,
                    offset,
                },
            });
            return response;
        }
        return { count: 0, pointsOfSale: [] };
    }
};
ListPointsOfSaleService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ListPointsOfSaleService);
exports.default = ListPointsOfSaleService;
