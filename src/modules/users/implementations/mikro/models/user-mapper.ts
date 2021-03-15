import User from '@modules/users/contracts/models/user';
import MikroUser from './mikro-user';

abstract class UserMapper {
  static toApi(data: MikroUser): User {
    const user = new User();
    Object.assign(user, data);
    return user;
  }

  static toOrm(data: User): MikroUser {
    const user = new MikroUser();
    Object.assign(user, data);
    return user;
  }
}

export default UserMapper;
