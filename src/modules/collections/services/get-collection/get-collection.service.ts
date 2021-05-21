import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  collectionId: string;
}

@injectable()
export default class GetCollectionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,
  ) {}

  async execute({
    userId,
    collectionId,
  }: Request): Promise<Collection | undefined> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const groupIds = await getGroupUniverse(user);

    const collection = await this.collectionsRepository.findOne(collectionId);

    if (!collection) throw AppError.collectionNotFound;

    if (!groupIds.includes(collection.groupId))
      throw AppError.authorizationError;

    return collection;
  }
}
