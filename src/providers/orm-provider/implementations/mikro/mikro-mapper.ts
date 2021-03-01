import Admin from '@modules/admins/contracts/models/admin';
import MikroAdmin from '@modules/admins/implementations/mikro/models/mikro-admin';
import Group from '@modules/groups/contracts/models/group';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import User from '@modules/users/contracts/models/user';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

abstract class MikroMapper {
  static map(entity: User): MikroUser;

  static map(entity: MikroUser): User;

  static map(entity: MikroGroup): Group;

  static map(entity: Group): MikroGroup;

  static map(entity: MikroPointOfSale): PointOfSale;

  static map(entity: PointOfSale): MikroPointOfSale;

  static map(entity: MikroAdmin): Admin;

  static map(entity: Admin): MikroAdmin;

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

    if (entity instanceof MikroPointOfSale) {
      const pointOfSale = new PointOfSale();
      Object.assign(pointOfSale, entity);
      return pointOfSale;
    }

    if (entity instanceof PointOfSale) {
      const mikroPointOfSale = new MikroPointOfSale();
      Object.assign(mikroPointOfSale, entity);
      return mikroPointOfSale;
    }

    if (entity instanceof MikroAdmin) {
      const admin = new Admin();
      Object.assign(admin, entity);
      return admin;
    }

    if (entity instanceof Admin) {
      const admin = new MikroAdmin();
      Object.assign(admin, entity);
      return admin;
    }
  }
}

export default MikroMapper;
