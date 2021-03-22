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
}

@injectable()
class ListMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({
    userId,
    categoryId,
    groupId,
    routeId,
    pointOfSaleId,
    serialNumber,
  }: Request): Promise<Machine[]> {
    const filters: FindMachinesDto = {};

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) filters.ownerId = user.id;

    if (user.role === Role.MANAGER) filters.groupIds = user.groupIds;

    if (user.role === Role.OPERATOR) filters.operatorId = user.id;

    filters.filters = {
      groupId,
      categoryId,
      routeId,
      pointOfSaleId,
      serialNumber,
    };

    const machines = await this.machinesRepository.find(filters);

    return machines;
  }
}
export default ListMachinesService;
