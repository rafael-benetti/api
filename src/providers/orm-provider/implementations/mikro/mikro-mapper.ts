import Admin from '@modules/admins/contracts/models/admin';
import MikroAdmin from '@modules/admins/implementations/mikro/models/mikro-admin';
import Group from '@modules/groups/contracts/models/group';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MikroMachineCategory from '@modules/machine-categories/implementations/mikro/models/mikro-machine-category';
import Machine from '@modules/machines/contracts/models/machine';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import Route from '@modules/routes/contracts/models/route';
import MikroRoute from '@modules/routes/implementations/models/mikro-route';
import User from '@modules/users/contracts/models/user';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';

abstract class MikroMapper {
  static map(entity: User): MikroUser;

  static map(entity: MikroUser): User;

  static map(entity: MikroPointOfSale): PointOfSale;

  static map(entity: PointOfSale): MikroPointOfSale;

  static map(entity: MikroAdmin): Admin;

  static map(entity: Admin): MikroAdmin;

  static map(entity: Route): MikroRoute;

  static map(entity: MikroRoute): Route;

  static map(entity: MikroMachine): Machine;

  static map(entity: Machine): MikroMachine;

  static map(entity: MikroGroup): Group;

  static map(entity: Group): MikroGroup;

  static map(entity: MikroMachineCategory): MachineCategory;

  static map(entity: MachineCategory): MikroMachineCategory;

  static map(entity: unknown): unknown {
    if (entity instanceof Route) {
      const mikroRoute = new MikroRoute();
      Object.assign(mikroRoute, entity);
      return mikroRoute;
    }

    if (entity instanceof MikroRoute) {
      const route = new Route();
      Object.assign(route, entity);
      return route;
    }

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

    if (entity instanceof MikroMachine) {
      const machine = new Machine();
      Object.assign(machine, entity);
      return machine;
    }

    if (entity instanceof Machine) {
      const machine = new MikroMachine();
      Object.assign(machine, entity);
      return machine;
    }

    if (entity instanceof MikroMachineCategory) {
      const machineCategory = new MachineCategory();
      Object.assign(machineCategory, entity);
      return machineCategory;
    }

    if (entity instanceof MachineCategory) {
      const mikroMachineCategory = new MikroMachineCategory();
      Object.assign(mikroMachineCategory, entity);
      return mikroMachineCategory;
    }
  }
}

export default MikroMapper;
