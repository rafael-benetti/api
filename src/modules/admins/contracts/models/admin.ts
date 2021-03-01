import { v4 } from 'uuid';
import CreateAdminDto from '../dtos/create-admin.dto';

class Admin {
  _id: string;

  email: string;

  password: string;

  name: string;

  constructor(data?: CreateAdminDto) {
    if (data) {
      this._id = v4();
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
    }
  }
}

export default Admin;
