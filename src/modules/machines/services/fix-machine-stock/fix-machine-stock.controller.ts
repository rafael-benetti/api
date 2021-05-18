import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import FixMachineStockService from './fix-machine-stock.service';

abstract class FixMachineStockController {
  static validate = celebrate({
    body: {
      boxId: Joi.string().required(),
      quantity: Joi.number().integer().required(),
      observations: Joi.string().required(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { boxId, quantity, observation } = request.body;
    const { machineId } = request.params;

    const fixMachineStock = container.resolve(FixMachineStockService);

    const machine = await fixMachineStock.execute({
      userId,
      machineId,
      boxId,
      quantity,
      observation,
    });

    return response.json(machine);
  };
}

export default FixMachineStockController;
