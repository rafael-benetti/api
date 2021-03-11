import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListOperatorsService from './list-operators.service';

abstract class ListOperatorsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query as { [key: string]: never };

    const listOperators = container.resolve(ListOperatorsService);

    const operators = await listOperators.execute({
      userId,
      groupId,
      limit,
      offset,
    });

    return res.json(operators);
  };
}

export default ListOperatorsController;
