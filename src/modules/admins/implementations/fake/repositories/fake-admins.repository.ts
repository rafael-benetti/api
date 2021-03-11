import CreateAdminDto from '@modules/admins/contracts/dtos/create-admin.dto';
import FindAdminDto from '@modules/admins/contracts/dtos/find-admin.dto';
import Admin from '@modules/admins/contracts/models/admin';
import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';

class FakeAdminsRepository implements AdminsRepository {
  private admins: Admin[] = [];

  create(data: CreateAdminDto): Admin {
    const admin = new Admin(data);
    this.admins.push(admin);
    return admin;
  }

  async findOne(data: FindAdminDto): Promise<Admin | undefined> {
    return this.admins.find(admin => admin[data.by] === data.value);
  }

  save(data: Admin): void {
    const index = this.admins.findIndex(admin => admin.id === data.id);
    this.admins[index] = data;
  }

  delete(data: Admin): void {
    const index = this.admins.indexOf(data);
    this.admins.splice(index, 1);
  }
}

export default FakeAdminsRepository;
