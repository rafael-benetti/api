import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId?: string;
  limit?: number;
  offset?: number;
}

@injectable()
export default class GetCollectionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,
  ) {}

  async execute({
    userId,
    machineId,
    limit,
    offset,
  }: Request): Promise<Collection[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const groupIds = await getGroupUniverse(user);

    const collections = await this.collectionsRepository.find({
      groupIds,
      machineId,
      limit,
      offset,
    });

    return collections;
  }
}
