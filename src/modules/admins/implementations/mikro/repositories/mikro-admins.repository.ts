import CreateAdminDto from '@modules/admins/contracts/dtos/create-admin.dto';
import FindAdminDto from '@modules/admins/contracts/dtos/find-admin.dto';
import Admin from '@modules/admins/contracts/models/admin';
import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import AdminMapper from '../models/admin-mapper';
import MikroAdmin from '../models/mikro-admin';

class MikroAdminsRepository implements AdminsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroAdmin);

  create(data: CreateAdminDto): Admin {
    const admin = new MikroAdmin(data);
    this.repository.persist(admin);
    return AdminMapper.toApi(admin);
  }

  async findOne(data: FindAdminDto): Promise<Admin | undefined> {
    const owner = await this.repository.findOne({
      [data.by]: data.value,
    });

    return owner ? AdminMapper.toApi(owner) : undefined;
  }

  save(data: Admin): void {
    const reference = this.repository.getReference(data.id);
    const admin = this.repository.assign(reference, data);
    this.repository.persist(admin);
  }

  delete(data: Admin): void {
    const admin = AdminMapper.toOrm(data);
    this.repository.remove(admin);
  }
}

export default MikroAdminsRepository;
