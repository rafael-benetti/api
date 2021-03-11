import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateOperatorService from './create-operator.service';

abstract class CreateOperatorController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { email, name, groupIds, permissions, phoneNumber } = req.body;

    const createOperator = container.resolve(CreateOperatorService);

    const operator = await createOperator.execute({
      userId,
      email,
      name,
      groupIds,
      permissions,
      phoneNumber,
    });

    return res.status(201).json(operator);
  };
}

export default CreateOperatorController;
