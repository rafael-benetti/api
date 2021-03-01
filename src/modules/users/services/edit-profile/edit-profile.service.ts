import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  name: string;
  phone: string;
  password: string;
  oldPassword: string;
}

@injectable()
class EditProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async execute({
    userId,
    name,
    phone,
    password,
    oldPassword,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(userId);

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

    await this.usersRepository.save(user);

    return user;
  }
}
export default EditProfileService;
