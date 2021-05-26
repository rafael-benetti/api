import CreateTelemetryLogDto from '../dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '../dtos/find-telemetry-logs.dto';
import GetIncomePerMachineResponseDto from '../dtos/get-income-per-machine-response.dto';
import GetIncomePerMachineDto from '../dtos/get-income-per-machine.dto';
import GetIncomePerPointOfSaleDto from '../dtos/get-income-per-point-of-sale.dto';
import TelemetryLog from '../entities/telemetry-log';

interface TelemetryLogsRepository {
  create(data: CreateTelemetryLogDto): TelemetryLog;
  find(
    data: FindTelemetryLogsDto,
  ): Promise<{ telemetryLogs: TelemetryLog[]; count: number }>;
  getIncomePerMachine(
    data: GetIncomePerMachineDto,
  ): Promise<GetIncomePerMachineResponseDto[]>;
  getIncomePerGroup(
    data: GetIncomePerMachineDto,
  ): Promise<GetIncomePerMachineResponseDto[]>;
  incomePerPointOfSale(
    data: GetIncomePerPointOfSaleDto,
  ): Promise<[{ income: number; id: string }]>;
}

export default TelemetryLogsRepository;
