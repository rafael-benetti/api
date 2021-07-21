import { celebrate, Joi } from 'celebrate';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import GetInvetoryService from './get-inventory.service';

export default abstract class GetInvetoryController {
  static validate = celebrate({
    query: {
      groupId: Joi.string(),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { groupId } = req.query;

    const getInvetoryService = container.resolve(GetInvetoryService);

    const response = await getInvetoryService.execute({
      userId,
      groupId: groupId as string,
    });

    return res.json(response);
  }
}
