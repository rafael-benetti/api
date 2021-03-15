import Admin from '@modules/admins/contracts/models/admin';
import MikroAdmin from './mikro-admin';

abstract class AdminMapper {
  static toApi(data: MikroAdmin): Admin {
    const admin = new Admin();
    Object.assign(admin, data);
    return admin;
  }

  static toOrm(data: Admin): MikroAdmin {
    const admin = new MikroAdmin();
    Object.assign(admin, data);
    return admin;
  }
}

export default AdminMapper;
