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
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const logs_repository_1 = __importDefault(require("../../../logs/contracts/repositories/logs-repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let RemoveFromMachineService = class RemoveFromMachineService {
    constructor(usersRepository, machinesRepository, groupsRepository, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, productId, machineId, boxId, toGroup, quantity, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        const universe = await get_group_universe_1.default(user);
        if (!is_in_group_universe_1.default({
            universe,
            groups: [machine.groupId],
            method: 'INTERSECTION',
        }))
            throw app_error_1.default.authorizationError;
        const box = machine.boxes.find(box => box.id === boxId);
        if (!box)
            throw app_error_1.default.boxNotFound;
        box.numberOfPrizes -= quantity;
        const group = await this.groupsRepository.findOne({
            by: 'id',
            value: machine.groupId,
        });
        if (!group)
            throw app_error_1.default.groupNotFound;
        const product = group.stock.prizes.find(product => product.id === productId);
        if (!product)
            throw app_error_1.default.productNotFound;
        if (toGroup) {
            product.quantity += quantity;
            this.groupsRepository.save(group);
        }
        else {
            const userProduct = user.stock?.prizes.find(product => product.id === productId);
            if (!userProduct) {
                user.stock?.prizes.push({
                    id: product.id,
                    label: product.label,
                    quantity,
                });
            }
            else {
                userProduct.quantity += quantity;
            }
            this.usersRepository.save(user);
        }
        this.logsRepository.create({
            createdBy: user.id,
            ownerId: user.ownerId || user.id,
            groupId: machine.groupId,
            type: log_type_enum_1.default.REMOVE_STOCK_FROM_MACHINE,
            machineId: machine.id,
            quantity,
        });
        await this.ormProvider.commit();
    }
};
RemoveFromMachineService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('LogsRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RemoveFromMachineService);
exports.default = RemoveFromMachineService;
