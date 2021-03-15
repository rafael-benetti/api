import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditManagerService from './edit-manager.service';

abstract class EditManagerController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { managerId } = req.params;
    const { groupIds, permissions, phoneNumber, isActive } = req.body;

    const editManager = container.resolve(EditManagerService);

    const manager = await editManager.execute({
      userId,
      managerId,
      groupIds,
      permissions,
      phoneNumber,
      isActive,
    });

    return res.json(manager);
  };
}

export default EditManagerController;
