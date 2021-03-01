import CreateAdminDto from '@modules/admins/contracts/dtos/create-admin.dto';
import FindAdminDto from '@modules/admins/contracts/dtos/find-admin.dto';
import Admin from '@modules/admins/contracts/models/admin';
import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroAdmin from '../models/mikro-admin';

class MikroAdminsRepository implements AdminsRepository {
  private entityManager = container.resolve<MikroOrmProvider>('OrmProvider')
    .entityManager;

  create(data: CreateAdminDto): Admin {
    const admin = new MikroAdmin(data);

    this.entityManager.persist(admin);

    return MikroMapper.map(admin);
  }

  async findOne(data: FindAdminDto): Promise<Admin | undefined> {
    const admin = await this.entityManager.findOne(MikroAdmin, {
      [data.by]: data.value,
    });

    return admin ? MikroMapper.map(admin) : undefined;
  }

  save(data: Admin): void {
    const admin = MikroMapper.map(data);
    this.entityManager.persist(admin);
  }

  delete(data: Admin): void {
    const admin = MikroMapper.map(data);
    this.entityManager.remove(admin);
  }
}

export default MikroAdminsRepository;
