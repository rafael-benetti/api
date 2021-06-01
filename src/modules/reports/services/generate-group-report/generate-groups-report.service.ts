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
import { endOfDay, startOfDay } from 'date-fns';
import ExcelJS from 'exceljs';
import logger from '@config/logger';
import exportGroupsReport from './export-groups-report';

interface Request {
  userId: string;
  startDate: Date;
  endDate: Date;
  download: boolean;
  groupIds: string[];
}

interface Response {
  groupLabel: string;
  numberOfMachines: number;
  income: number;
  prizePurchaseAmount: number;
  prizePurchaseCost: number;
  maintenance: number;
  rent: number;
  remoteCreditCost: number;
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

  async execute({
    userId,
    endDate,
    startDate,
    download,
    groupIds,
  }: Request): Promise<
    | {
        date: {
          startDate: Date;
          endDate: Date;
        };
        groupsAnalytics: Response[];
      }
    | ExcelJS.Workbook
  > {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    const universe = await getGroupUniverse(user);

    let groups;
    if (groupIds) {
      groups = await this.groupsRepository.find({
        filters: {
          ids: groupIds,
        },
      });
      logger.info(groupIds);

      if (user.role === Role.OWNER)
        if (groups.some(group => group.ownerId !== user.id))
          throw AppError.authorizationError;

      logger.info('ai');
      if (user.role === Role.MANAGER)
        if (groups.some(group => !user.groupIds?.includes(group.id)))
          throw AppError.authorizationError;
    } else {
      groups = await this.groupsRepository.find({
        filters: {
          ids: universe,
        },
      });
    }

    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);

    const groupsAnalytics = await Promise.all(
      groups.map(async group => {
        const numberOfMachinesPromise = this.machinesRepository.count({
          groupIds: [group.id],
        });

        const incomePerPointOfSalePromise = this.telemetryLogsRepository.incomePerPointOfSale(
          {
            groupIds: [group.id],
            endDate,
            startDate,
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
          incomePerPointOfSale,
          { pointsOfSale },
          productLogs,
          { machineLogs },
        ] = await Promise.all([
          numberOfMachinesPromise,
          incomePerPointOfSalePromise,
          pointsOfSalePromise,
          productLogsPromise,
          remoteCreditsPromise,
        ]);

        const income = incomePerPointOfSale.reduce((a, b) => a + b.income, 0);

        const productLogsPrizes = productLogs.filter(
          productLog => productLog.productType === 'PRIZE',
        );

        const prizePurchaseAmount = productLogsPrizes.reduce(
          (a, b) => a + b.quantity,
          0,
        );

        const prizePurchaseCost = productLogsPrizes.reduce((a, b) => {
          return b.logType === 'IN'
            ? a + b.cost * b.quantity
            : a - b.cost * b.quantity;
        }, 0);

        const maintenance = productLogs
          .filter(productLog => productLog.productType === 'SUPPLY')
          .reduce((a, b) => {
            return b.logType === 'IN'
              ? a + b.cost * b.quantity
              : a - b.cost * b.quantity;
          }, 0);

        const rent = pointsOfSale
          .map(pointOfSale =>
            pointOfSale.isPercentage
              ? (incomePerPointOfSale.find(
                  pointOfSaleIncome => pointOfSaleIncome.id === pointOfSale.id,
                )?.income ?? 0) *
                (pointOfSale.rent / 100)
              : pointOfSale.rent,
          )
          .reduce((a, b) => a + b, 0);

        const remoteCreditCost = machineLogs.reduce(
          (a, b) => a + b.quantity,
          0,
        );

        const balance = income - (prizePurchaseCost + maintenance + rent);

        return {
          groupLabel: group.label ? group.label : 'Parceria Pessoal',
          numberOfMachines: numberOfMachines || 0,
          income: income || 0,
          prizePurchaseAmount: prizePurchaseAmount || 0,
          prizePurchaseCost: prizePurchaseCost || 0,
          maintenance: maintenance || 0,
          rent: rent || 0,
          remoteCreditCost: remoteCreditCost || 0,
          balance: balance || 0,
        };
      }),
    );

    if (download) {
      const Workbook = await exportGroupsReport({
        date: {
          startDate,
          endDate,
        },
        groupsAnalytics,
      });

      return Workbook;
    }

    return {
      date: {
        startDate,
        endDate,
      },
      groupsAnalytics,
    };
  }
}
