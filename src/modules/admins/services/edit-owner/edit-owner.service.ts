import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  ownerId: string;
  adminId: string;
  name?: string;
  password?: string;
  phoneNumber?: string;
  stateRegistration?: string;
  document?: string;
  subscriptionPrice?: string;
  subscriptionExpirationDate?: string;
  isActive?: boolean;
}

@injectable()
class EditOwnerService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    ownerId,
    name,
    password,
    adminId,
    document,
    phoneNumber,
    stateRegistration,
    subscriptionExpirationDate,
    subscriptionPrice,
    isActive,
  }: Request): Promise<User> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: ownerId,
    });

    if (!user) throw AppError.userNotFound;

    if (password) user.password = this.hashProvider.hash(password);

    if (name) user.name = name;

    if (document) user.document = document;

    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (isActive !== undefined && isActive !== null) user.isActive = isActive;

    if (stateRegistration) user.stateRegistration = stateRegistration;

    if (subscriptionExpirationDate)
      user.subscriptionExpirationDate = subscriptionExpirationDate;

    if (subscriptionPrice) user.subscriptionPrice = subscriptionPrice;

    this.usersRepository.save(user);

    await this.ormProvider.commit();

    return user;
  }
}

export default EditOwnerService;
