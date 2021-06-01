import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateTelemetryBoardService from './create-telemetry-board.service';

abstract class CreateTelemetryBoardController {
  static validate = celebrate({
    body: {
      ownerId: Joi.string().uuid().required(),
      integratedCircuitCardId: Joi.string(),
    },
  });

  static handle: RequestHandler = async (req, res) => {
    const { ownerId, integratedCircuitCardId } = req.body;

    const createTelemetryBoard = container.resolve(CreateTelemetryBoardService);

    const telemetryBoard = await createTelemetryBoard.execute({
      ownerId,
      integratedCircuitCardId,
    });

    return res.json(telemetryBoard);
  };
}

export default CreateTelemetryBoardController;
