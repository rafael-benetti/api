import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import { Promise } from 'bluebird';
import { inject, injectable } from 'tsyringe';
import UniversalFinancialRepository from '@modules/universal-financial/contracts/repositories/universal-financial.repository';
import AppError from '@shared/errors/app-error';
import Role from '@modules/users/contracts/enums/role';
import getGroupUniverse from '@shared/utils/get-group-universe';

interface Request {
  userId: string;
  groupId: string;
}

interface Response {
  machinesPerCategory: {
    categoryLabel: string;
    totalInStock: number;
    totalInOperation: number;
  }[];
  prizes: {
    prizeLabel: string | undefined;
    prizeId: string;
    machinesTotalPrizes: string | number;
    groupsTotalPrizes: string | number;
    usersTotalPrizes: string | number;
  }[];
  supplies: {
    supplieLabel: string | undefined;
    supplieId: string;
    groupsTotalSupplies: string | number;
    usersTotalSupplies: string | number;
  }[];
}

@injectable()
export default class GetInvetoryService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('UniversalFinancialRepository')
    private universalFinancialRepository: UniversalFinancialRepository,
  ) {}

  async execute({ groupId, userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    let groupIds;

    if (user.role === Role.OPERATOR) throw AppError.authorizationError;
    if (user.role === Role.MANAGER)
      groupIds = groupId ? [groupId] : user.groupIds;
    if (user.role === Role.OWNER)
      groupIds = groupId ? [groupId] : await getGroupUniverse(user);

    const machinesPerCategoryPromise = this.machinesRepository.machinePerCategory(
      {
        groupIds,
      },
    );

    const machinesInventoryByProductPromise = this.machinesRepository.machinesInventoryByProduct(
      {
        groupIds,
      },
    );

    const usersInventoryByProductPromise = this.usersRepository.usersInventoryByProduct(
      {
        filters: {
          groupIds,
        },
      },
    );

    const groupsInventoryByProductPromise = this.groupsRepository.groupsInvertoryByProduct(
      {
        filters: {
          ids: groupIds,
        },
      },
    );

    const usersInventoryBySuppliePromise = this.usersRepository.usersInventoryBySupplies(
      {
        filters: {
          groupIds,
        },
      },
    );

    const groupsInventoryBySupplie = await this.groupsRepository.groupsInvertoryBySupplies(
      {
        filters: {
          ids: groupIds,
        },
      },
    );

    const [
      machinesPerCategory,
      machinesInventoryByProduct,
      usersInventoryByProduct,
      groupsInventoryByProduct,
      usersInventoryBySupplie,
    ] = await Promise.all([
      machinesPerCategoryPromise,
      machinesInventoryByProductPromise,
      usersInventoryByProductPromise,
      groupsInventoryByProductPromise,
      usersInventoryBySuppliePromise,
    ]);

    const allProducts = [
      ...groupsInventoryByProduct,
      ...machinesInventoryByProduct,
      ...usersInventoryByProduct,
    ];

    const allSuplies = [
      ...usersInventoryBySupplie,
      ...groupsInventoryBySupplie,
    ];

    const supliesIds = [
      ...new Set(allSuplies.map(supplie => supplie.supplieId)),
    ].filter(supplieId => supplieId);

    const productsIds = [
      ...new Set(allProducts.map(product => product.prizeId)),
    ].filter(productId => productId);

    const suppliesResponse = supliesIds.map(supplieId => {
      const groupsSupplies = groupsInventoryBySupplie.find(
        groupSupplie => groupSupplie.supplieId === supplieId,
      );

      const usersSupplies = usersInventoryBySupplie.find(
        userSupplie => userSupplie.supplieId === supplieId,
      );

      return {
        supplieLabel:
          groupsSupplies?.supplieLabel || usersSupplies?.supplieLabel,
        supplieId,
        groupsTotalSupplies: groupsSupplies?.totalSupplies || 0,
        usersTotalSupplies: usersSupplies?.totalSupplies || 0,
      };
    });

    const productsResponse = productsIds.map(productId => {
      const machinesProducts = machinesInventoryByProduct.find(
        machineProduct => machineProduct.prizeId === productId,
      );

      const groupsProducts = groupsInventoryByProduct.find(
        groupProduct => groupProduct.prizeId === productId,
      );

      const usersProducts = usersInventoryByProduct.find(
        userProduct => userProduct.prizeId === productId,
      );

      return {
        prizeLabel:
          machinesProducts?.prizeLabel ||
          groupsProducts?.prizeLabel ||
          usersProducts?.prizeLabel,
        prizeId: productId,
        machinesTotalPrizes: machinesProducts?.totalPrizes || 0,
        groupsTotalPrizes: groupsProducts?.totalPrizes || 0,
        usersTotalPrizes: usersProducts?.totalPrizes || 0,
      };
    });

    return {
      machinesPerCategory,
      prizes: productsResponse,
      supplies: suppliesResponse,
    };
  }
}
