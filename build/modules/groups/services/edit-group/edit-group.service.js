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
const group_1 = __importDefault(require("../../contracts/models/group"));
const groups_repository_1 = __importDefault(require("../../contracts/repositories/groups.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let EditGroupService = class EditGroupService {
    constructor(usersRepository, groupsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, groupId, label }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER &&
            (!user.permissions?.editGroups || !user.groupIds?.includes(groupId)))
            throw app_error_1.default.authorizationError;
        const group = await this.groupsRepository.findOne({
            by: 'id',
            value: groupId,
        });
        if (!group)
            throw app_error_1.default.groupNotFound;
        if (label)
            group.label = label;
        this.groupsRepository.save(group);
        await this.ormProvider.commit();
        return group;
    }
};
EditGroupService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], EditGroupService);
exports.default = EditGroupService;
