import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import DeleteMachineService from './delete-machine.service';

abstract class DeleteMachineController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { machineId } = req.params;

    const deleteMachine = container.resolve(DeleteMachineService);

    await deleteMachine.execute({
      userId,
      machineId,
    });

    return res.status(204).send();
  };
}

export default DeleteMachineController;
