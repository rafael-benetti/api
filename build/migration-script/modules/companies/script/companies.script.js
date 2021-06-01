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
const type_companies_repository_1 = __importDefault(require("../typeorm/repositories/type-companies.repository"));
let CompaniesScript = class CompaniesScript {
    constructor(typeCompaniesRepository, groupsRepository, ormProvider) {
        this.typeCompaniesRepository = typeCompaniesRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        const companies = await this.typeCompaniesRepository.find();
        for (const typeCompany of companies) {
            // ANCHOR: CHECAR SE REALMENTE É ISSO
            const isPersonalArray = ['Pessoal', '1.01 BLACK ENTERTAINMENT'];
            const group = this.groupsRepository.create({
                label: typeCompany.name,
                isPersonal: isPersonalArray.includes(typeCompany.name),
                ownerId: typeCompany.ownerId.toString(),
            });
            await this.client.set(`@groups:${typeCompany.id}`, `${group.id}`);
        }
        await this.ormProvider.commit();
        this.ormProvider.clear();
    }
    async setOwnerId() {
        this.ormProvider.clear();
        const groups = await this.groupsRepository.find({
            filters: {},
        });
        for (const group of groups) {
            const ownerId = (await this.client.get(`@users:${group.ownerId}`));
            group.ownerId = ownerId;
            this.groupsRepository.save(group);
        }
        await this.ormProvider.commit();
    }
};
CompaniesScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeCompaniesRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_companies_repository_1.default, Object, Object])
], CompaniesScript);
exports.default = CompaniesScript;
