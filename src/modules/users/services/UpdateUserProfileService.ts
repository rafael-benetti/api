import logger from '@config/logger';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: number;
  name: string;
  phone: string;
  password: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    name,
    password,
    phone,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.userNotFound;
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = password;
    }
    if (phone) {
      user.phone = phone;
    }

    const updatedUser = await this.usersRepository.save(user);

    logger.info(updatedUser);

    return updatedUser;
  }
}

export default UpdateUserProfileService;
