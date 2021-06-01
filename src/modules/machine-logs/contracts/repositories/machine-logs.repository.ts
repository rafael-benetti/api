import CreateMachineLogDto from '../dtos/create-machine-log.dto';
import FindMachineLogsDto from '../dtos/find-machine-logs.dto';
import MachineLog from '../entities/machine-log';

export default interface MachineLogsRepository {
  create(data: CreateMachineLogDto): MachineLog;
  find(
    data: FindMachineLogsDto,
  ): Promise<{
    machineLogs: MachineLog[];
    count: number;
  }>;
  save(data: MachineLog): void;
}
