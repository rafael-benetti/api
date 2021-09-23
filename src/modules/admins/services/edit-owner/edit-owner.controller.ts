import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditOwnerService from './edit-owner.service';

abstract class CreateOwnerController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const {
      email,
      name,
      ownerId,
      password,
      phoneNumber,
      stateRegistration,
      document,
      subscriptionPrice,
      subscriptionExpirationDate,
    } = req.body;

    const editOwnerService = container.resolve(EditOwnerService);

    const owner = await editOwnerService.execute({
      adminId: userId,
      email,
      name,
      ownerId,
      password,
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
