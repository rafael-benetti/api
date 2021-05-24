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
const ioredis_1 = __importDefault(require("ioredis"));
const type_companies_repository_1 = __importDefault(require("../../companies/typeorm/repositories/type-companies.repository"));
const categories_repository_1 = __importDefault(require("../../../../modules/categories/contracts/repositories/categories.repository"));
const couter_types_repository_1 = __importDefault(require("../../../../modules/counter-types/contracts/repositories/couter-types.repository"));
const counter_1 = __importDefault(require("../../../../modules/machines/contracts/models/counter"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const box_1 = __importDefault(require("../../../../modules/machines/contracts/models/box"));
const logger_1 = __importDefault(require("../../../../config/logger"));
const type_users_repository_1 = __importDefault(require("../../users/typeorm/repostories/type-users-repository"));
const type_machine_categories_repository_1 = __importDefault(require("../typeorm/repositories/type-machine-categories.repository"));
let MachineCategoriesScript = class MachineCategoriesScript {
    constructor(typeCompaniesRepository, categoriesRepository, machineCategoriesRepository, counterTypesRepository, typeUsersRepository, ormProvider) {
        this.typeCompaniesRepository = typeCompaniesRepository;
        this.categoriesRepository = categoriesRepository;
        this.machineCategoriesRepository = machineCategoriesRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.typeUsersRepository = typeUsersRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        this.ormProvider.clear();
        const typeUsers = await this.typeUsersRepository.find();
        const typeOwners = typeUsers.filter(typeUser => typeUser.id === typeUser.ownerId);
        try {
            for (const typeOwner of typeOwners) {
                const ownerId = (await this.client.get(`@users:${typeOwner.id}`));
                const typeMachineCategories = await this.machineCategoriesRepository.listAllCategories(typeOwner.id);
                for (const typeMachineCategory of typeMachineCategories) {
                    const counters = [];
                    const boxes = [];
                    const counterTypes = await this.counterTypesRepository.find({
                        ownerId,
                    });
                    const counterTypeIdIn = counterTypes.find(counterType => counterType.label === 'Noteiro')?.id;
                    const counterTypeIdOut = counterTypes.find(counterType => counterType.label === 'Prêmio')?.id;
                    if (!counterTypeIdIn || !counterTypeIdOut)
                        throw app_error_1.default.counterTypeNotFound;
                    if (typeMachineCategory.name === 'Vintage' ||
                        typeMachineCategory.name === 'Tomacat' ||
                        typeMachineCategory.name === 'Magic Bear' ||
                        typeMachineCategory.name === 'Luck Star' ||
                        typeMachineCategory.name === 'Grua Lucky Star' ||
                        typeMachineCategory.name === 'Grua Black' ||
                        typeMachineCategory.name === 'Black' ||
                        typeMachineCategory.name === 'Big Mega Plush' ||
                        typeMachineCategory.name === 'Big Black') {
                        boxes.push(new box_1.default({
                            // ? CONTADOR DE SAIDA
                            counters: [
                                new counter_1.default({
                                    counterTypeId: counterTypeIdOut,
                                    hasDigital: false,
                                    hasMechanical: false,
                                    pin: undefined,
                                }),
                                // ? CONTADOR DE ENTRADA
                                new counter_1.default({
                                    counterTypeId: counterTypeIdIn,
                                    hasDigital: false,
                                    hasMechanical: false,
                                    pin: undefined,
                                }),
                            ],
                        }));
                    }
                    if (typeMachineCategory.name === 'Mega Plush' ||
                        typeMachineCategory.name === 'MAQ. DE TIRO') {
                        // ? CONTADORES DE ENTRADA
                        for (let i = 0; i < 2; i += 1) {
                            counters.push(new counter_1.default({
                                counterTypeId: counterTypeIdIn,
                                hasDigital: false,
                                hasMechanical: false,
                                pin: undefined,
                            }));
                        }
                        // ? CONTADOR DE SAIDA
                        counters.push(new counter_1.default({
                            counterTypeId: counterTypeIdOut,
                            hasDigital: false,
                            hasMechanical: false,
                            pin: undefined,
                        }));
                        boxes.push(new box_1.default({
                            counters,
                        }));
                    }
                    if (typeMachineCategory.name === 'Tomacat + Dupla') {
                        for (let i = 0; i < 3; i += 1) {
                            boxes.push(new box_1.default({
                                counters: [
                                    // ? CONTADORES DE ENTRADA
                                    new counter_1.default({
                                        counterTypeId: counterTypeIdIn,
                                        hasDigital: false,
                                        hasMechanical: false,
                                        pin: undefined,
                                    }),
                                    // ? CONTADORES DE SAIDA
                                    new counter_1.default({
                                        counterTypeId: counterTypeIdOut,
                                        hasDigital: false,
                                        hasMechanical: false,
                                        pin: undefined,
                                    }),
                                ],
                            }));
                        }
                    }
                    if (typeMachineCategory.name === 'Caminhão' ||
                        typeMachineCategory.name === 'Big Truck') {
                        for (let i = 0; i < 6; i += 1) {
                            boxes.push(new box_1.default({
                                counters: [
                                    // ? CONTADORES DE ENTRADA
                                    new counter_1.default({
                                        counterTypeId: counterTypeIdIn,
                                        hasDigital: false,
                                        hasMechanical: false,
                                        pin: undefined,
                                    }),
                                    // ? CONTADORES DE SAIDA
                                    new counter_1.default({
                                        counterTypeId: counterTypeIdOut,
                                        hasDigital: false,
                                        hasMechanical: false,
                                        pin: undefined,
                                    }),
                                ],
                            }));
                        }
                    }
                    if (typeMachineCategory.name === 'Roleta') {
                        // ? CONTADORES DE ENTRADA
                        counters.push(new counter_1.default({
                            counterTypeId: counterTypeIdIn,
                            hasDigital: false,
                            hasMechanical: false,
                            pin: undefined,
                        }));
                        // ? CONTADORES DE SAIDA
                        for (let i = 0; i < 9; i += 1) {
                            counters.push(new counter_1.default({
                                counterTypeId: counterTypeIdOut,
                                hasDigital: false,
                                hasMechanical: false,
                                pin: undefined,
                            }));
                        }
                        boxes.push(new box_1.default({
                            counters,
                        }));
                    }
                    const category = this.categoriesRepository.create({
                        label: typeMachineCategory.name,
                        ownerId,
                        boxes,
                    });
                    await this.client.set(`@categories:${typeMachineCategory.id}`, `${category.id}`);
                }
            }
        }
        catch (error) {
            logger_1.default.info(error);
        }
        await this.ormProvider.commit();
    }
};
MachineCategoriesScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeCompaniesRepository')),
    __param(1, tsyringe_1.inject('CategoriesRepository')),
    __param(2, tsyringe_1.inject('MachineCategoriesRepository')),
    __param(3, tsyringe_1.inject('CounterTypesRepository')),
    __param(4, tsyringe_1.inject('TypeUsersRepository')),
    __param(5, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_companies_repository_1.default, Object, type_machine_categories_repository_1.default, Object, type_users_repository_1.default, Object])
], MachineCategoriesScript);
exports.default = MachineCategoriesScript;
