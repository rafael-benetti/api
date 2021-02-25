/* eslint-disable array-callback-return */
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class FindUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: number): Promise<User[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const users = await this.usersRepository.findByOwnerId(user.ownerId);

    const filteredUsers = users.filter(userItem => userItem.id !== user.id);

    return filteredUsers;
  }
}

export default FindUsersService;
