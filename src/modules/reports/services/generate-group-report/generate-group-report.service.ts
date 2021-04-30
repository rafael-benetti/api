import { differenceInCalendarDays } from 'date-fns';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { inject, injectable } from 'tsyringe';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';

interface Request {
  userId: string;
  dates: {
    startDate: Date;
    endDate: Date;
  };
}

interface Response {
  groupId: string;
  groupLabel?: string;
  income: number;
  averageIncomePerDay: number;
  plays: number;
  givenPrizes: number;
  playsPerPrize: number;
  productExpenses: number;
  productGains: number;
  profit: number;
}

@injectable()
export default class GenerateGroupReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('ProductLogsRepository')
    private productLogsRepository: ProductLogsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({ userId, dates }: Request): Promise<Response[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    const universe = await getGroupUniverse(user);

    const groups = await this.groupsRepository.find({
      filters: {
        ids: universe,
      },
    });

    return Promise.all(
      groups.map(async group => {
        const telemetryLogs = await this.telemetryLogsRepository.find({
          filters: {
            groupId: group.id,
            date: dates,
          },
        });

        const plays = telemetryLogs.filter(log => log.type === 'IN');

        const income = plays.map(log => log.value).reduce((a, b) => a + b, 0);

        const givenPrizes = telemetryLogs
          .filter(log => log.type === 'OUT')
          .map(log => log.value)
          .reduce((a, b) => a + b, 0);

        const playsPerPrize =
          plays.length / (givenPrizes === 0 ? 1 : givenPrizes);

        const numberOfDays = differenceInCalendarDays(
          dates.endDate,
          dates.startDate,
        );

        const averageIncomePerDay = income / numberOfDays;

        const productLogs = await this.productLogsRepository.find({
          filters: {
            groupId: group.id,
            startDate: dates.startDate,
            endDate: dates.endDate,
          },
        });

        const productExpenses = productLogs
          .filter(log => log.logType === 'IN')
          .map(log => log.cost * log.quantity)
          .reduce((a, b) => a + b, 0);

        const productGains = productLogs
          .filter(log => log.logType === 'OUT')
          .map(log => log.cost * log.quantity)
          .reduce((a, b) => a + b, 0);

        return {
          groupLabel: group.label,
          groupId: group.id,
          income,
          averageIncomePerDay,
          plays: plays.length,
          givenPrizes,
          playsPerPrize,
          productExpenses,
          productGains,
          profit: income + productGains - productExpenses,
        };
      }),
    );
  }
}
