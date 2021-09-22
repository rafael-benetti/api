"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isInGroupUniverse = (data) => {
    if (data.method === 'INTERSECTION') {
        return data.groups.some(group => data.universe.includes(group));
    }
    return data.groups.every(group => data.universe.includes(group));
};
exports.default = isInGroupUniverse;
