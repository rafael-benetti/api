import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  collectionId: string;
}

@injectable()
class ReviewCollectionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ userId, collectionId }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const collection = await this.collectionsRepository.findOne(collectionId);

    if (!collection) throw AppError.collectionNotFound;

    if (collection.reviewedData?.date) throw AppError.collectionAlreadyReviewed;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role === Role.OWNER) {
      const groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);

      if (!groupIds.includes(collection.groupId))
        throw AppError.authorizationError;
    }

    if (user.role === Role.MANAGER)
      if (!user.groupIds?.includes(collection.groupId))
        throw AppError.authorizationError;

    collection.reviewedData = {
      date: new Date(),
      reviewedBy: user.id,
      reviewerName: user.name,
    };

    this.collectionsRepository.save(collection);

    await this.ormProvider.commit();
  }
}

export default ReviewCollectionService;
