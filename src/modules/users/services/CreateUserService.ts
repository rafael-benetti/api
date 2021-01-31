import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/app-error';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  isActive: number;
  roles: string;
  isOperator: number;
  picture: string;
  ownerId: number;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(data: IRequest): Promise<User> {
    const { email } = data;
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw AppError.emailAlreadyUsed;
    }

    const user = await this.usersRepository.create(data);

    return user;
  }
}

export default CreateUserService;
