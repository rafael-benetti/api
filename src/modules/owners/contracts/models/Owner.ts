import ICreateOwnerDto from '../dtos/ICreateOwnerDto';

class Owner {
  id: string;

  name: string;

  email: string;

  password: string;

  isActive: boolean;

  constructor(data?: ICreateOwnerDto) {
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.isActive = data.isActive;
    }
  }
}

export default Owner;
