import CreateAdminDto from '../dtos/create-admin.dto';
import FindAdminDto from '../dtos/find-admin.dto';
import Admin from '../models/admin';

interface AdminsRepository {
  create(data: CreateAdminDto): Admin;
  findOne(data: FindAdminDto): Promise<Admin | undefined>;
  save(data: Admin): void;
  delete(data: Admin): void;
}

export default AdminsRepository;
