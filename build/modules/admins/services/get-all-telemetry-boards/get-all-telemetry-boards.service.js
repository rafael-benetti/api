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
const telemetry_board_1 = __importDefault(require("../../../telemetry/contracts/entities/telemetry-board"));
const telemetry_boards_repository_1 = __importDefault(require("../../../telemetry/contracts/repositories/telemetry-boards.repository"));
const tsyringe_1 = require("tsyringe");
let GetAllTelemetryBoardsService = class GetAllTelemetryBoardsService {
    constructor(telemetryBoardsRepository) {
        this.telemetryBoardsRepository = telemetryBoardsRepository;
    }
    async execute() {
        const telemetryBoards = this.telemetryBoardsRepository.find({
            filters: {},
        });
        return telemetryBoards;
    }
};
GetAllTelemetryBoardsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TelemetryBoardsRepository')),
    __metadata("design:paramtypes", [Object])
], GetAllTelemetryBoardsService);
exports.default = GetAllTelemetryBoardsService;
