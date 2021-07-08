import CreateTelemetryLogDto from '../dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '../dtos/find-telemetry-logs.dto';
import GetGroupIncomePerPeriodDto from '../dtos/get-group-income-per-period.dto';
import GetIncomePerCounterTypeDto from '../dtos/get-income-per-counter-type.dto';
import GetIncomePerMachineResponseDto from '../dtos/get-income-per-machine-response.dto';
import GetIncomePerMachineDto from '../dtos/get-income-per-machine.dto';
import GetIncomePerPointOfSaleDto from '../dtos/get-income-per-point-of-sale.dto';
import GetMachineIncomePerDay from '../dtos/get-machine-income-per-day';
import GetPointOfSaleIncomePerDateDto from '../dtos/get-point-of-sale-income-per-date.dto';
import GetPrizesPerMachineResponseDto from '../dtos/get-prizes-per-machine-repository.dto';
import TelemetryLog from '../entities/telemetry-log';

interface TelemetryLogsRepository {
  create(data: CreateTelemetryLogDto): TelemetryLog;
  findAndCount(
    data: FindTelemetryLogsDto,
  ): Promise<{ telemetryLogs: TelemetryLog[]; count: number }>;

  find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]>;

  getPointOfSaleIncomePerDate({
    startDate,
    endDate,
    pointOfSaleId,
    withHours,
  }: GetPointOfSaleIncomePerDateDto): Promise<
    {
      total: number;
      id: { date: string; type: 'IN' | 'OUT'; machineId: string };
    }[]
  >;

  getIncomePerMachine(
    data: GetIncomePerMachineDto,
  ): Promise<GetIncomePerMachineResponseDto[]>;
  getPrizesPerMachine(
    data: GetIncomePerMachineDto,
  ): Promise<GetPrizesPerMachineResponseDto[]>;
  getIncomePerGroup(
    data: GetIncomePerMachineDto,
  ): Promise<GetIncomePerMachineResponseDto[]>;
  incomePerPointOfSale(
    data: GetIncomePerPointOfSaleDto,
  ): Promise<[{ income: number; id: string }]>;
  getMachineIncomePerDay({
    groupIds,
    startDate,
    endDate,
    machineId,
  }: GetMachineIncomePerDay): Promise<
    { income: number; id: string; date: Date }[]
  >;

  getMachineGivenPrizesPerDay({
    groupIds,
    startDate,
    endDate,
    machineId,
  }: GetMachineIncomePerDay): Promise<
    { givenPrizes: number; id: { date: string; pin: number }; date: Date }[]
  >;

  getGroupIncomePerPeriod(
    data: GetGroupIncomePerPeriodDto,
  ): Promise<{ total: number; id: string; date: Date }[]>;

  getIncomePerCounterType(
    data: GetIncomePerCounterTypeDto,
  ): Promise<{ total: number; counterLabel: string }[]>;

  save(data: TelemetryLog): void;
}

export default TelemetryLogsRepository;
