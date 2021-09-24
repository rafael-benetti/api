import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import { container } from 'tsyringe';

const getGroupUniverse = async (user: User): Promise<string[]> => {
  const groupsRepository =
    container.resolve<GroupsRepository>('GroupsRepository');

  if (user.role === Role.OWNER) {
    const groupUniverse = await groupsRepository
      .find({
        filters: {
          ownerId: user.id,
        },
      })
      .then(groups => groups.map(group => group.id));

    return groupUniverse;
  }

  return user.groupIds || [];
};

export default getGroupUniverse;
