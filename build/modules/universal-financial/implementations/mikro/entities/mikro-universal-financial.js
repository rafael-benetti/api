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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const create_universal_financial_dto_1 = __importDefault(require("../../../contracts/dtos/create-universal-financial.dto"));
const universal_financial_1 = __importDefault(require("../../../contracts/entities/universal-financial"));
let MikroUniversalFinancial = class MikroUniversalFinancial {
    constructor(data) {
        if (data) {
            this.id = data.id;
            this.cashIncome = data.cashIncome;
            this.coinIncome = data.coinIncome;
            this.creditCardIncome = data.creditCardIncome;
            this.date = data.date;
            this.givenPrizes = data.givenPrizes;
            this.groupId = data.groupId;
            this.others = data.others;
            this.ownerId = data.ownerId;
            this.remoteCredit = data.remoteCredit;
        }
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", String)
], MikroUniversalFinancial.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroUniversalFinancial.prototype, "date", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUniversalFinancial.prototype, "groupId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "cashIncome", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "coinIncome", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "creditCardIncome", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "givenPrizes", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "others", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "ownerId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroUniversalFinancial.prototype, "remoteCredit", void 0);
MikroUniversalFinancial = __decorate([
    core_1.Entity({ collection: 'universal-financial' }),
    __metadata("design:paramtypes", [Object])
], MikroUniversalFinancial);
exports.default = MikroUniversalFinancial;
