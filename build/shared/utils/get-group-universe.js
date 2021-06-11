"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groups_repository_1 = __importDefault(require("../../modules/groups/contracts/repositories/groups.repository"));
const role_1 = __importDefault(require("../../modules/users/contracts/enums/role"));
const user_1 = __importDefault(require("../../modules/users/contracts/models/user"));
const tsyringe_1 = require("tsyringe");
const getGroupUniverse = async (user) => {
    const groupsRepository = tsyringe_1.container.resolve('GroupsRepository');
    if (user.role === role_1.default.OWNER) {
        const groupUniverse = await groupsRepository
            .find({
            filters: {
                ownerId: user.id,
            },
        })
            .then(groups => groups.map(group => group.id));
        return groupUniverse;
    }
    return user.groupIds || [];
};
exports.default = getGroupUniverse;
