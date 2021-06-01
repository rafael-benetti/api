import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';

import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  name?: string;
  deviceToken?: string;
  password?: {
    old: string;
    new: string;
  };
  file?: unknown;
  phoneNumber?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    userId,
    name,
    password,
    file,
    phoneNumber,
    deviceToken,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (name) user.name = name;

    if (password) {
      if (!this.hashProvider.compare(password.old, user.password))
        throw AppError.incorrectEmailOrPassword;

      user.password = this.hashProvider.hash(password.new);
    }

    if (file) {
      if (user.photo) this.storageProvider.deleteFile(user.photo.key);

      user.photo = await this.storageProvider.uploadFile(file);
    }

    if (deviceToken) user.deviceToken = deviceToken;

    if (phoneNumber) user.phoneNumber = phoneNumber;

    this.usersRepository.save(user);

    await this.ormProvider.commit();

    return user;
  }
}

export default UpdateUserProfileService;
