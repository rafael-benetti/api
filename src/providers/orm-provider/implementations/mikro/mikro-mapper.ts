import Group from '@modules/groups/contracts/models/group';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import User from '@modules/users/contracts/models/user';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

abstract class MikroMapper {
  static map(entity: User): MikroUser;

  static map(entity: MikroUser): User;

  static map(entity: MikroGroup): Group;

  static map(entity: Group): MikroGroup;

  static map(entity: unknown): unknown {
    if (entity instanceof User) {
      const mikroUser = new MikroUser();

      Object.assign(mikroUser, entity);

      return mikroUser;
    }

    if (entity instanceof MikroUser) {
      const user = new User();

      Object.assign(user, entity);

      return user;
    }

    if (entity instanceof MikroGroup) {
      const group = new Group();

      Object.assign(group, entity);

      return group;
    }

    if (entity instanceof Group) {
      const mikroGroup = new MikroGroup();

      Object.assign(mikroGroup, entity);

      return mikroGroup;
    }
  }
}

export default MikroMapper;
