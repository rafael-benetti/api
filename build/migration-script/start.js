"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
require("reflect-metadata");
require("express-async-errors");
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../providers/orm-provider/contracts/models/orm-provider"));
require("../shared/container/index");
require("../providers/index");
require("./modules/index");
// eslint-disable-next-line import/no-extraneous-dependencies
const logger_1 = __importDefault(require("../config/logger"));
const typeorm_1 = require("typeorm");
const users_script_1 = __importDefault(require("./modules/users/script/users.script"));
const companies_script_1 = __importDefault(require("./modules/companies/script/companies.script"));
const telemetries_script_1 = __importDefault(require("./modules/telemetries/scripts/telemetries.script"));
const credits_script_1 = __importDefault(require("./modules/credits/scripts/credits.script"));
const gifts_script_1 = __importDefault(require("./modules/gifts/scripts/gifts.script"));
const machines_categories_script_1 = __importDefault(require("./modules/machines-categories/scripts/machines-categories.script"));
const machines_script_1 = __importDefault(require("./modules/machines/scripts/machines.script"));
const machine_collect_script_1 = __importDefault(require("./modules/machine-collect/scripts/machine-collect.script"));
const start = async () => {
    typeorm_1.createConnections();
    const ormProvider = tsyringe_1.container.resolve('OrmProvider');
    await ormProvider.connect();
    const usersScript = tsyringe_1.container.resolve(users_script_1.default);
    const companiesScript = tsyringe_1.container.resolve(companies_script_1.default);
    const telemetryScript = tsyringe_1.container.resolve(telemetries_script_1.default);
    const creditsScript = tsyringe_1.container.resolve(credits_script_1.default);
    const giftsScript = tsyringe_1.container.resolve(gifts_script_1.default);
    const machinesScript = tsyringe_1.container.resolve(machines_script_1.default);
    const machineCategoriesScript = tsyringe_1.container.resolve(machines_categories_script_1.default);
    const machineCollectScript = tsyringe_1.container.resolve(machine_collect_script_1.default);
    //
    // await usersScript.execute();
    // logger.info('usersScript.execute()');
    //
    // await companiesScript.execute();
    // logger.info('companiesScript.execute()');
    //
    // await machinesScript.createCountersTypes();
    // logger.info('machinesScript.createCountersTypes()');
    //
    // await machineCategoriesScript.execute();
    // logger.info('machineCategoriesScript.execute()');
    //
    // await usersScript.setOwnerId();
    // logger.info('usersScript.setOwnerId');
    //
    // await usersScript.setGroupIds();
    // logger.info('usersScript.setGroupIds()');
    //
    // await companiesScript.setOwnerId();
    // logger.info('companiesScript.setOwnerId()');
    //
    await telemetryScript.execute();
    logger_1.default.info('telemetryScript.execute()');
    //
    // await companiesScript.setOwnerId();
    // logger.info('companiesScript.setOwnerId()');
    //
    // await machinesScript.execute();
    // logger.info('machinesScript.execute()');
    //
    // await telemetryScript.setMachineId();
    // logger.info('setasdasd');
    //
    // await creditsScript.execute();
    // logger.info('creditsScript.execute()');
    //
    // await giftsScript.execute();
    // logger.info('giftsScript.execute()');
    //
    // await machineCollectScript.execute();
    // logger.info('setasdasd');
    //
    // await machineCollectScript.setPreviousCollection();
    // logger.info('setasdasd');
};
start();
