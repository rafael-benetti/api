import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import fs from 'fs';
import logger from '@config/logger';
import S3Service from '@shared/container/providers/aws.S3';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: number;
  name?: string;
  photo?: string;
  description?: string;
  phone?: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('S3Service')
    private s3Service: S3Service,
  ) {}

  public async execute({
    userId,
    name,
    photo,
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

    if (photo) {
      if (process.env.STORAGE_TYPE === 'S3') {
        // this.s3Service.deleteObject({
        //  bucketName: process.env.BUCKET_NAME || '',
        //  key: user.pic
        // });

        user.picture = photo;
      }
      if (user.picture) {
        try {
          await fs.promises.unlink(user.picture);
        } catch (error) {
          logger.error(error);
        }
      }
      user.picture = photo;
    }

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default UpdateUserProfileService;
