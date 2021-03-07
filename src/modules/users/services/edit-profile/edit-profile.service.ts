import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  name?: string;
  phone?: string;
  password?: string;
  oldPassword?: string;
  file?: unknown;
}

@injectable()
class EditProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('StorageProvider')
    private storageProvider: StorageProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    name,
    phone,
    password,
    oldPassword,
    file,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password && oldPassword) {
      const checkOldPassword = this.hashProvider.compare(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) throw AppError.oldPasswordDoesMatch;

      user.password = this.hashProvider.hash(password);
    }

    if (file) {
      if (user.photo) this.storageProvider.deleteFile(user.photo.key);

      const photo = await this.storageProvider.uploadFile(file);

      user.photo = {
        key: photo.key,
        downloadUrl: photo.downloadUrl,
      };
    }

    this.usersRepository.save(user);

    await this.ormProvider.commit();

    return user;
  }
}
export default EditProfileService;
