import Group from '@modules/groups/contracts/models/group';
import MikroGroup from './mikro-group';

abstract class GroupMapper {
  static toApi(data: MikroGroup): Group {
    const group = new Group();
    Object.assign(group, data);
    return group;
  }

  static toOrm(data: Group): MikroGroup {
    const group = new MikroGroup();
    Object.assign(group, data);
    return group;
  }
}

export default GroupMapper;
