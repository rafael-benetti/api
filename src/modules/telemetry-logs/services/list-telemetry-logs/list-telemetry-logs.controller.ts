import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListTelemetryLogsService from './list-telemetry-logs.service';

export default abstract class ListTelemetryLogsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { machineId, startDate, endDate, type, limit, offset } = req.query;

    const listTelemetryLogsService = container.resolve(
      ListTelemetryLogsService,
    );

    const telemetryLogs = await listTelemetryLogsService.execute({
      userId,
      machineId: machineId as string,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      type: type as 'IN' | 'OUT',
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json(telemetryLogs);
  }
}
