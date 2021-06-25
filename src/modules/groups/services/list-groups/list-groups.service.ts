import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { Promise } from 'bluebird';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  limit?: number;
  offset?: number;
}

@injectable()
class ListGroupsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,
  ) {}

  async execute({
    userId,
    limit,
    offset,
  }: Request): Promise<
    {
      group: Group;
      machinesCount: number;
    }[]
  > {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
        limit,
        offset,
      });

      const findCountOfMachines = groups.map(async group => {
        const machinesCount = await this.machinesRepository.count({
          groupIds: [group.id],
        });

        return {
          group,
          machinesCount,
        };
      });

      const response = await Promise.all(findCountOfMachines);

      return response;
    }

    const groups = await this.groupsRepository.find({
      filters: {
        ownerId: user.id,
      },
      limit,
      offset,
    });

    const findCountOfMachines = groups.map(async group => {
      const machinesCount = await this.machinesRepository.count({
        groupIds: [group.id],
      });

      return {
        group,
        machinesCount,
      };
    });

    const response = await Promise.all(findCountOfMachines);

    return response;
  }
}

export default ListGroupsService;
