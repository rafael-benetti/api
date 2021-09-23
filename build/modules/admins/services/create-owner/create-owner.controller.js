"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const create_owner_service_1 = __importDefault(require("./create-owner.service"));
class CreateOwnerController {
}
CreateOwnerController.validate = celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().required(),
        name: celebrate_1.Joi.string().required(),
        type: celebrate_1.Joi.string().valid('INDIVIDUAL', 'COMPANY').required(),
        phoneNumber: celebrate_1.Joi.string().required(),
        stateRegistration: celebrate_1.Joi.string(),
        document: celebrate_1.Joi.string().required(),
        subscriptionPrice: celebrate_1.Joi.number().required(),
        subscriptionExpirationDate: celebrate_1.Joi.date().required(),
    },
});
CreateOwnerController.handle = async (req, res) => {
    const { userId } = req;
    const { email, name, type, phoneNumber, stateRegistration, document, subscriptionPrice, subscriptionExpirationDate, } = req.body;
    const createOwner = tsyringe_1.container.resolve(create_owner_service_1.default);
    const owner = await createOwner.execute({
        adminId: userId,
        email,
        name,
        type,
        phoneNumber,
        stateRegistration,
        document,
        subscriptionPrice,
        subscriptionExpirationDate,
    });
    return res.json(owner);
};
exports.default = CreateOwnerController;
