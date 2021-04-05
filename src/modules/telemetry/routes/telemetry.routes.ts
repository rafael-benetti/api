import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import ListTelemetryBoardsController from '../services/list-telemetry-boards/list-telemetry-boards.controller';
import ReceiveTelemetryMessageController from '../services/receive-telemetry-message/receive-telemetry-message.controller';

const telemetryRoutes = Router();

telemetryRoutes.use(authHandler);

telemetryRoutes.post(
  '/:telemetryId/message',
  ReceiveTelemetryMessageController.handle,
);

telemetryRoutes.get('/', ListTelemetryBoardsController.handle);

export default telemetryRoutes;
