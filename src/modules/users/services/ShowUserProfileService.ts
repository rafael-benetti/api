import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRespository: IUsersRepository,
  ) {}

  public async execute(id: number): Promise<User | undefined> {
    const user = await this.usersRespository.findById(id);

    if (!user) {
      throw AppError.userNotFound;
    }

    return user;
  }
}

export default ShowUserProfileService;
