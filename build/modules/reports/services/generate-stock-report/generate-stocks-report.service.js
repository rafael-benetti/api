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
const tsyringe_1 = require("tsyringe");
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const group_1 = __importDefault(require("../../../groups/contracts/models/group"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const product_1 = __importDefault(require("../../../users/contracts/models/product"));
const export_stocks_report_1 = __importDefault(require("./export-stocks-report"));
let GenerateStockReportService = class GenerateStockReportService {
    constructor(usersRepository, groupsRepository) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
    }
    async execute({ userId, groupId, download, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.MANAGER && user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        if (user.role !== role_1.default.OWNER && !user.permissions?.generateReports)
            throw app_error_1.default.authorizationError;
        let groupIds = [];
        let groups = [];
        if (groupId) {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: groupId,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            if (user.role === role_1.default.OWNER && group.ownerId !== user.id)
                throw app_error_1.default.authorizationError;
            if (user.role === role_1.default.MANAGER && !user.groupIds?.includes(group.id))
                throw app_error_1.default.authorizationError;
            groups = [group];
            groupIds.push(groupId);
        }
        else if (user.role === role_1.default.MANAGER) {
            if (!user.groupIds)
                throw app_error_1.default.unknownError;
            groupIds = user.groupIds;
            groups = await this.groupsRepository.find({
                filters: {
                    ids: user.groupIds,
                },
            });
        }
        else if (user.role === role_1.default.OWNER) {
            groups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
                fields: ['id', 'label'],
            });
        }
        groupIds = groups.map(group => group.id);
        const users = await this.usersRepository.find({
            filters: {
                groupIds,
            },
            fields: ['id', 'stock', 'name', 'groupIds'],
        });
        const columnsPrizes = [];
        const columnsSupliers = [];
        users.forEach(user => user.stock?.prizes.forEach(prize => {
            if (!columnsPrizes.map(cp => cp.id).includes(prize.id))
                columnsPrizes.push({ id: prize.id, label: prize.label });
        }));
        users.forEach(user => user.stock?.supplies.forEach(supplier => {
            if (!columnsSupliers.map(cp => cp.id).includes(supplier.id))
                columnsSupliers.push({ id: supplier.id, label: supplier.label });
        }));
        const usersResponse = users.map(user => {
            const groupLabels = user.groupIds?.map(groupId => groups.find(group => group.id === groupId)?.label
                ? groups.find(group => group.id === groupId)?.label
                : 'Parceria Pessoal');
            return {
                id: user.id,
                name: user.name,
                prizes: user.stock?.prizes,
                supplies: user.stock?.supplies,
                groupLabels,
            };
        });
        if (download) {
            const Workbook = await export_stocks_report_1.default({
                columnsPrizes,
                columnsSupliers,
                users: usersResponse,
            });
            return Workbook;
        }
        return {
            columnsPrizes,
            columnsSupliers,
            users: usersResponse,
        };
    }
};
GenerateStockReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GenerateStockReportService);
exports.default = GenerateStockReportService;
