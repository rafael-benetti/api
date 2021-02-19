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
  userId: number;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    name,
    email,
    isActive,
    isOperator,
    password,
    phone,
    picture,
    roles,
    username,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw AppError.emailAlreadyUsed;
    }

    const newUser = await this.usersRepository.create({
      ownerId: user.ownerId,
      name,
      email,
      username,
      roles,
      picture,
      phone,
      password,
      isOperator,
      isActive,
    });

    return newUser;
  }
}

export default CreateUserService;
