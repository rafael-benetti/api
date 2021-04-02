import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  adminId: string;
  email: string;
  name: string;
}

@injectable()
class CreateOwnerService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ adminId, email, name }: Request): Promise<void> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const emailExists = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (emailExists) throw AppError.emailAlreadyUsed;

    const user = this.usersRepository.create({
      email,
      password: this.hashProvider.hash('q1'),
      name,
      role: Role.OWNER,
    });

    this.groupsRepository.create({
      isPersonal: true,
      ownerId: user.id,
    });

    this.counterTypesRepository.create({
      label: 'Moedeiro',
      type: 'IN',
      ownerId: user.id,
    });

    this.counterTypesRepository.create({
      label: 'Noteiro',
      type: 'IN',
      ownerId: user.id,
    });

    this.counterTypesRepository.create({
      label: 'Crédito',
      type: 'IN',
      ownerId: user.id,
    });

    this.counterTypesRepository.create({
      label: 'Prêmio',
      type: 'OUT',
      ownerId: user.id,
    });

    await this.ormProvider.commit();
  }
}

export default CreateOwnerService;
