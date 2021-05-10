"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../config/logger"));
const mongo_1 = __importDefault(require("../../../../config/mongo"));
const core_1 = require("@mikro-orm/core");
const mikro_admin_1 = __importDefault(require("../../../../modules/admins/implementations/mikro/models/mikro-admin"));
const mikro_category_1 = __importDefault(require("../../../../modules/categories/implementations/mikro/model/mikro-category"));
const mikro_collection_1 = __importDefault(require("../../../../modules/collections/implementations/mikro/entities/mikro-collection"));
const mikro_counter_type_1 = __importDefault(require("../../../../modules/counter-types/implementations/mikro/models/mikro-counter-type"));
const mikro_group_1 = __importDefault(require("../../../../modules/groups/implementations/mikro/models/mikro-group"));
const mikro_machine_1 = __importDefault(require("../../../../modules/machines/implementations/mikro/models/mikro-machine"));
const mikro_point_of_sale_1 = __importDefault(require("../../../../modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale"));
const mikro_product_log_1 = __importDefault(require("../../../../modules/products/implementations/mikro/entities/mikro-product-log"));
const mikro_route_1 = __importDefault(require("../../../../modules/routes/implementations/mikro/models/mikro-route"));
const mikro_telemetry_log_1 = __importDefault(require("../../../../modules/telemetry-logs/implementations/mikro/entities/mikro-telemetry-log"));
const mikro_telemetry_board_1 = __importDefault(require("../../../../modules/telemetry/implementations/mikro/entities/mikro-telemetry-board"));
const mikro_user_1 = __importDefault(require("../../../../modules/users/implementations/mikro/models/mikro-user"));
const orm_provider_1 = __importDefault(require("../../contracts/models/orm-provider"));
class MikroOrmProvider {
    constructor() {
        this.forkMiddleware = (req, res, next) => {
            core_1.RequestContext.create(this.entityManager, next);
        };
    }
    async connect() {
        const orm = await core_1.MikroORM.init({
            type: 'mongo',
            forceUndefined: true,
            clientUrl: mongo_1.default.url,
            entities: [
                mikro_admin_1.default,
                mikro_user_1.default,
                mikro_group_1.default,
                mikro_machine_1.default,
                mikro_point_of_sale_1.default,
                mikro_category_1.default,
                mikro_route_1.default,
                mikro_counter_type_1.default,
                mikro_telemetry_board_1.default,
                mikro_collection_1.default,
                mikro_telemetry_log_1.default,
                mikro_product_log_1.default,
            ],
            implicitTransactions: true,
            debug: true,
            // ensureIndexes: true,
        });
        this.entityManager = orm.em;
        this.entityManager.getDriver().createCollections();
        logger_1.default.info('🔌 - App connected to the database');
    }
    async commit() {
        await this.entityManager.flush();
    }
    async clear() {
        this.entityManager.clear();
    }
}
exports.default = MikroOrmProvider;
