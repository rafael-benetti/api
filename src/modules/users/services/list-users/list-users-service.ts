import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute(userId: string): Promise<User[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) {
      const users = await this.usersRepository.findByOwnerId(user._id);
      return users;
    }
    if (user.role === Role.MANAGER) {
      if (user.groupIds) {
        const users = await this.usersRepository.findByGroupIds(user.groupIds);
        return users;
      }
    }

    return [];
  }
}
export default ListUsersService;
