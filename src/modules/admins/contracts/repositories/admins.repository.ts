import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateAdminDto from '../dtos/create-admin.dto';
import Admin from '../models/admin';

interface AdminsRepository {
  create(data: CreateAdminDto): Admin;
  findOne(data: FindEntityDto<Admin>): Promise<Admin | undefined>;
  save(data: Admin): void;
  delete(data: Admin): void;
}

export default AdminsRepository;
