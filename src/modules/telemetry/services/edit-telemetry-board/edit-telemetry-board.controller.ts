import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditTelemetryBoardService from './edit-telemetry-board.service';

abstract class EditTelemetryBoardController {
  static validate = celebrate({
    body: {
      groupId: Joi.string().uuid().required(),
    },
    params: {
      telemetryId: Joi.number().required(),
    },
  });

  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { telemetryId } = req.params as Record<string, never>;
    const { groupId } = req.body;

    const editTelemetryBoard = container.resolve(EditTelemetryBoardService);

    const telemetryBoard = await editTelemetryBoard.execute({
      userId,
      telemetryId,
      groupId,
    });

    return res.json(telemetryBoard);
  };
}

export default EditTelemetryBoardController;
