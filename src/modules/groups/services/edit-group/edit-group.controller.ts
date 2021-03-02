import { container } from 'tsyringe';
import { Request, Response } from 'express';
import EditGroupService from './edit-group.service';

abstract class EditGroupController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label } = req.body;
    const { groupId } = req.query;

    const editGroupService = container.resolve(EditGroupService);

    const group = await editGroupService.execute({
      userId,
      label,
      groupId: groupId as string,
    });

    return res.json(group);
  }
}

export default EditGroupController;
