import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ReceiveTelemetryMessageService from './receive-telemetry-message.service';

abstract class ReceiveTelemetryMessageController {
  static handle: RequestHandler = async (req, res) => {
    const { telemetryId } = req.params;

    const receiveTelemetryMessage = container.resolve(
      ReceiveTelemetryMessageService,
    );

    await receiveTelemetryMessage.execute({
      telemetryId,
    });

    return res.status(204).send();
  };
}

export default ReceiveTelemetryMessageController;
