import { inject, injectable } from 'tsyringe';

import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import Role from '@modules/users/contracts/enums/role';
import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Product from '@modules/users/contracts/models/product';
import ExcelJS from 'exceljs';
import exportStocksReport from './export-stocks-report';

interface Request {
  userId: string;
  groupId: string;
  download: boolean;
}

interface Response {
  columnsSupliers: { id: string; label: string }[];
  columnsPrizes: { id: string; label: string }[];
  users: {
    id: string;
    name: string;
    prizes: Product[] | undefined;
    supplies: Product[] | undefined;
    groupLabels: (string | undefined)[] | undefined;
  }[];
}

@injectable()
export default class GenerateStockReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    download,
  }: Request): Promise<Response | ExcelJS.Workbook> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    let groupIds: string[] = [];
    let groups: Group[] = [];

    if (groupId) {
      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      if (user.role === Role.OWNER && group.ownerId !== user.id)
        throw AppError.authorizationError;

      if (user.role === Role.MANAGER && !user.groupIds?.includes(group.id))
        throw AppError.authorizationError;

      groups = [group];
      groupIds.push(groupId);
    } else if (user.role === Role.MANAGER) {
      if (!user.groupIds) throw AppError.unknownError;
      groupIds = user.groupIds;
      groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
      });
    } else if (user.role === Role.OWNER) {
      groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
        fields: ['id', 'label'],
      });
    }

    groupIds = groups.map(group => group.id);

    const users = await this.usersRepository.find({
      filters: {
        groupIds,
      },
      fields: ['id', 'stock', 'name', 'groupIds'],
    });

    const columnsPrizes: { id: string; label: string }[] = [];
    const columnsSupliers: { id: string; label: string }[] = [];

    users.forEach(user =>
      user.stock?.prizes.forEach(prize => {
        if (!columnsPrizes.map(cp => cp.id).includes(prize.id))
          columnsPrizes.push({ id: prize.id, label: prize.label });
      }),
    );

    users.forEach(user =>
      user.stock?.supplies.forEach(supplier => {
        if (!columnsSupliers.map(cp => cp.id).includes(supplier.id))
          columnsSupliers.push({ id: supplier.id, label: supplier.label });
      }),
    );

    const usersResponse = users.map(user => {
      const groupLabels = user.groupIds?.map(groupId =>
        groups.find(group => group.id === groupId)?.label
          ? groups.find(group => group.id === groupId)?.label
          : 'Parceria Pessoal',
      );

      return {
        id: user.id,
        name: user.name,
        prizes: user.stock?.prizes,
        supplies: user.stock?.supplies,
        groupLabels,
      };
    });

    if (download) {
      const Workbook = await exportStocksReport({
        columnsPrizes,
        columnsSupliers,
        users: usersResponse,
      });

      return Workbook;
    }

    return {
      columnsPrizes,
      columnsSupliers,
      users: usersResponse,
    };
  }
}
