import Admin from '@modules/admins/contracts/models/admin';
import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  email: string;
  name: string;
}

@injectable()
class CreateAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ email, name }: Request): Promise<Admin> {
    const emailExists = await this.adminsRepository.findOne({
      by: 'email',
      value: email,
    });

    if (emailExists) throw AppError.emailAlreadyUsed;

    const admin = this.adminsRepository.create({
      email,
      password: this.hashProvider.hash('q1'),
      name,
    });

    await this.ormProvider.commit();

    return admin;
  }
}

export default CreateAdminService;
