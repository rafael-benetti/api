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
const create_category_dto_1 = __importDefault(require("../../../contracts/dtos/create-category.dto"));
const category_1 = __importDefault(require("../../../contracts/models/category"));
const box_1 = __importDefault(require("../../../../machines/contracts/models/box"));
const uuid_1 = require("uuid");
let MikroCategory = class MikroCategory {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.label = data.label;
            this.boxes = data.boxes;
            this.ownerId = data.ownerId;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroCategory.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCategory.prototype, "label", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroCategory.prototype, "boxes", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCategory.prototype, "ownerId", void 0);
MikroCategory = __decorate([
    core_1.Entity({ collection: 'categories' }),
    __metadata("design:paramtypes", [Object])
], MikroCategory);
exports.default = MikroCategory;
