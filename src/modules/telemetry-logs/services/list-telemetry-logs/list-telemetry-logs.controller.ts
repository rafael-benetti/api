import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListTelemetryLogsService from './list-telemetry-logs.service';

export default abstract class ListTelemetryLogsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId, limit, offset } = req.query;

    const listTelemetryLogsService = container.resolve(
      ListTelemetryLogsService,
    );

    const telemetryLogs = await listTelemetryLogsService.execute({
      userId,
      machineId: machineId as string,
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json(telemetryLogs);
  }
}
