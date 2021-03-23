import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import FindMachinesDto from '@modules/machines/contracts/dtos/find-machines.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  categoryId: string;
  groupId: string;
  routeId: string;
  pointOfSaleId: string;
  serialNumber: string;
  isActive: boolean;
  offset: number;
  limit: number;
}

interface Result {
  machines: Machine[];
  count: number;
}

@injectable()
class ListMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  public async execute({
    userId,
    categoryId,
    groupId,
    routeId,
    pointOfSaleId,
    serialNumber,
    isActive,
  }: Request): Promise<Result> {
    const filters: FindMachinesDto = {};

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) filters.ownerId = user.id;

    if (user.role === Role.MANAGER) filters.groupIds = user.groupIds;

    if (user.role === Role.OPERATOR) filters.operatorId = user.id;

    if (groupId) {
      if (!user.groupIds?.includes(groupId) && user.role !== Role.OWNER)
        throw AppError.authorizationError;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      if (user.role === Role.OWNER && user.id !== group.ownerId)
        throw AppError.authorizationError;

      filters.groupIds = [groupId];
    }
    filters.categoryId = categoryId;
    filters.routeId = routeId;
    filters.pointOfSaleId = pointOfSaleId;
    filters.serialNumber = serialNumber;

    filters.isActive = isActive;

    const result = await this.machinesRepository.find(filters);

    return result;
  }
}
export default ListMachinesService;
