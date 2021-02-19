import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import fs from 'fs';
import logger from '@config/logger';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: number;
  name?: string;
  picture?: string;
  phone?: string;
  password?: string;
  oldPassword?: string;
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
    picture,
    password,
    oldPassword,
    phone,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.userNotFound;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password && !oldPassword) {
      throw AppError.oldPasswordIsMissing;
    }

    if (password && oldPassword) {
      // TODO: IMPLEMENTAR COMPARE

      const checkOldPassword = user.password === oldPassword;

      if (!checkOldPassword) {
        throw AppError.oldPasswordDoesMatch;
      }

      user.password = password;
    }

    logger.info(picture);

    if (picture) {
      logger.info(process.env.STORAGE_TYPE);
      if (process.env.STORAGE_TYPE === 'S3') {
        logger.info('sssss');
      } else {
        if (user.picture) {
          try {
            await fs.promises.unlink(user.picture);
          } catch (error) {
            logger.error(error);
          }
        }
        user.picture = picture;
      }
    }

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default UpdateUserProfileService;
