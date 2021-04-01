import { Router } from 'express';
import ReceiveTelemetryMessageController from '../services/receive-telemetry-message/receive-telemetry-message.controller';

const telemetryRoutes = Router();

telemetryRoutes.post(
  '/:telemetryId/message',
  ReceiveTelemetryMessageController.handle,
);

export default telemetryRoutes;
