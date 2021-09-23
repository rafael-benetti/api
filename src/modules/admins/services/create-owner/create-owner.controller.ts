import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateOwnerService from './create-owner.service';

abstract class CreateOwnerController {
  static validate = celebrate({
    body: {
      email: Joi.string().required(),
      name: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      type: Joi.string().valid('INDIVIDUAL', 'COMPANY').required(),
      stateRegistration: Joi.string(),
      document: Joi.string().required(),
      subscriptionPrice: Joi.number().required(),
      subscriptionExpirationDate: Joi.date().required(),
    },
  });

  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const {
      email,
      name,
      type,
      phoneNumber,
      stateRegistration,
      document,
      subscriptionPrice,
      subscriptionExpirationDate,
    } = req.body;

    const createOwner = container.resolve(CreateOwnerService);

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
}

export default CreateOwnerController;
