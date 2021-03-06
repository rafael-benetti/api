import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import RemoveFromMachineService from './remove-from-machine.service';

export default abstract class RemoveFromMachineController {
  static validate = celebrate({
    body: {
      machineId: Joi.string().uuid().required(),
      boxId: Joi.string().uuid().required(),
      quantity: Joi.number().required(),
      toGroup: Joi.bool().required(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { machineId, boxId, quantity, toGroup } = request.body;
    const { productId } = request.params;

    const removeFromMachine = container.resolve(RemoveFromMachineService);

    await removeFromMachine.execute({
      userId,
      productId,
      machineId,
      boxId,
      quantity,
      toGroup,
    });

    return response.status(204).send();
  };
}
