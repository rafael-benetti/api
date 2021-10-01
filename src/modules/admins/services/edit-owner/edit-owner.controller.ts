import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditOwnerService from './edit-owner.service';

abstract class EditOwnerController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { ownerId } = req.params;
    const {
      name,
      password,
      phoneNumber,
      stateRegistration,
      document,
      subscriptionPrice,
      subscriptionExpirationDate,
      isActive,
    } = req.body;

    const editOwnerService = container.resolve(EditOwnerService);

    const owner = await editOwnerService.execute({
      adminId: userId,
      name,
      ownerId,
      password,
      phoneNumber,
      stateRegistration,
      document,
      subscriptionPrice,
      subscriptionExpirationDate,
      isActive,
    });

    return res.json(owner);
  };
}

export default EditOwnerController;
