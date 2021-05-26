import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { inject, injectable } from 'tsyringe';
import ProductLogsRepository from '@modules/products/contracts/repositories/product-logs.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import { Promise } from 'bluebird';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';

interface Request {
  userId: string;
  startDate: Date;
  endDate: Date;
}

interface Response {
  groupId: string;
  groupLabel: string;
  numberOfMachines: number;
  income: number;
  givenPrizes: number;
  productExpenses: number;
  maintenceExpenses: number;
  rent: number;
  remote: number;
  balance: number;
}

@injectable()
export default class GenerateGroupReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('ProductLogsRepository')
    private productLogsRepository: ProductLogsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,
  ) {}

  async execute({ userId, endDate, startDate }: Request): Promise<Response[]> {
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

    const promises = Promise.all(
      groups.map(async group => {
        const numberOfMachinesPromise = this.machinesRepository.count({
          groupIds: [group.id],
        });

        const incomeMachinesPromise = this.telemetryLogsRepository.getIncomePerMachine(
          {
            groupIds: [group.id],
            startDate,
            endDate,
          },
        );

        const pointsOfSalePromise = this.pointsOfSaleRepository.find({
          by: 'groupId',
          value: group.id,
        });

        const productLogsPromise = this.productLogsRepository.find({
          filters: {
            endDate,
            startDate,
            groupId: group.id,
            logType: 'IN',
          },
        });

        const remoteCreditsPromise = this.machineLogsRepository.find({
          startDate,
          endDate,
          groupId: group.id,
          type: MachineLogType.REMOTE_CREDIT,
        });

        const [
          numberOfMachines,
          incomeMachines,
          { pointsOfSale },
          productLogs,
          { machineLogs },
        ] = await Promise.all([
          numberOfMachinesPromise,
          incomeMachinesPromise,
          pointsOfSalePromise,
          productLogsPromise,
          remoteCreditsPromise,
        ]);

        const productLogsPrizes = productLogs.filter(
          productLog => productLog.productType === 'PRIZE',
        );

        const prizePurchaseAmount = productLogsPrizes.reduce(
          (a, b) => a + b.quantity,
          0,
        );

        const prizePurchaseCost = productLogsPrizes.reduce(
          (a, b) => a + b.cost,
          0,
        );

        const maintenceConst = productLogs
          .filter(productLog => productLog.productType === 'SUPPLY')
          .reduce((a, b) => a + b.cost, 0);

        const rent = pointsOfSale.reduce((a, b) => a + b.rent, 0);

        const remoteCreditCost = machineLogs.reduce(
          (a, b) => a + b.quantity,
          0,
        );
      }),
    );
  }
}
