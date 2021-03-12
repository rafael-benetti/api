import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditGroupService from './edit-group.service';

abstract class EditGroupController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId } = req.params;
    const { label } = req.body;

    const editGroup = container.resolve(EditGroupService);

    const group = await editGroup.execute({
      userId,
      groupId,
      label,
    });

    return res.json(group);
  };
}

export default EditGroupController;
