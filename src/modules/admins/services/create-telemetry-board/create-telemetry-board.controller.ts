import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateTelemetryBoardService from './create-telemetry-board.service';

abstract class CreateTelemetryBoardController {
  static validate = celebrate({
    body: {
      ownerId: Joi.string().uuid().required(),
    },
  });

  static handle: RequestHandler = async (req, res) => {
    const { ownerId } = req.body;

    const createTelemetryBoard = container.resolve(CreateTelemetryBoardService);

    const telemetryBoard = await createTelemetryBoard.execute({
      ownerId,
    });

    return res.json(telemetryBoard);
  };
}

export default CreateTelemetryBoardController;
