import logger from '@config/logger';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditOperatorService from './edit-operator.service';

abstract class EditOperatorController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { operatorId } = req.params;
    const { groupIds, permissions, phoneNumber, isActive } = req.body;
    logger.info(groupIds);

    const editOperator = container.resolve(EditOperatorService);

    const operator = await editOperator.execute({
      userId,
      operatorId,
      groupIds,
      permissions,
      phoneNumber,
      isActive,
    });

    return res.json(operator);
  };
}

export default EditOperatorController;
