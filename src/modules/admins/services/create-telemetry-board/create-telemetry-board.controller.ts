import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateTelemetryBoardService from './create-telemetry-board.service';

abstract class CreateTelemetryBoardController {
  static handle: RequestHandler = async (req, res) => {
    const { ownerId, label } = req.body;

    const createTelemetryBoard = container.resolve(CreateTelemetryBoardService);

    const telemetryBoard = await createTelemetryBoard.execute({
      ownerId,
      label,
    });

    return res.json(telemetryBoard);
  };
}

export default CreateTelemetryBoardController;
