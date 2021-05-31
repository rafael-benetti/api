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
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const groups_repository_1 = __importDefault(require("../../../../modules/groups/contracts/repositories/groups.repository"));
const ioredis_1 = __importDefault(require("ioredis"));
const type_companies_repository_1 = __importDefault(require("../../companies/typeorm/repositories/type-companies.repository"));
const points_of_sale_repository_1 = __importDefault(require("../../../../modules/points-of-sale/contracts/repositories/points-of-sale.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const address_1 = __importDefault(require("../../../../modules/points-of-sale/contracts/models/address"));
const selling_points_repostory_1 = __importDefault(require("../typeorm/repositories/selling-points.repostory"));
let SellingPointsScript = class SellingPointsScript {
    constructor(typeCompaniesRepository, groupsRepository, typeSellingPointsRepository, pointsOfSaleRepository, ormProvider) {
        this.typeCompaniesRepository = typeCompaniesRepository;
        this.groupsRepository = groupsRepository;
        this.typeSellingPointsRepository = typeSellingPointsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        this.ormProvider.clear();
        const typeSellingPoints = await this.typeSellingPointsRepository.find();
        for (const typeSellingPoint of typeSellingPoints) {
            const groupId = (await this.client.get(`@groups:${typeSellingPoint.companyId}`));
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: groupId,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            const ownerId = (await this.client.get(`@users:${group.ownerId}`));
            const address = {
                city: typeSellingPoint.address.city,
                extraInfo: typeSellingPoint.address.note,
                neighborhood: typeSellingPoint.address.neighborhood,
                number: typeSellingPoint.address.number
                    ? typeSellingPoint.address.number.toString()
                    : '',
                state: typeSellingPoint.address.state,
                street: typeSellingPoint.address.street,
                zipCode: typeSellingPoint.address.zipCode,
            };
            const sellingPoint = this.pointsOfSaleRepository.create({
                label: typeSellingPoint.name,
                contactName: typeSellingPoint.responsible,
                primaryPhoneNumber: typeSellingPoint.phone1,
                secondaryPhoneNumber: typeSellingPoint.phone2,
                isPercentage: false,
                rent: 0,
                groupId,
                ownerId,
                address,
            });
            await this.client.set(`@points:${typeSellingPoint.id}`, `${sellingPoint.id}`);
        }
        await this.ormProvider.commit();
    }
};
SellingPointsScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeCompaniesRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('TypeSellingPointsRepository')),
    __param(3, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_companies_repository_1.default, Object, selling_points_repostory_1.default, Object, Object])
], SellingPointsScript);
exports.default = SellingPointsScript;
