import logger from '@config/logger';
import UsersCompanies from '@modules/companies/infra/typeorm/entities/UsersCompanies';
import IUsersCompaniesRepository from '@modules/companies/repositories/IUsersCompaniesRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive: number;
  companyIds: number[];
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersCompaniesRepository')
    private usersCompaniesRepository: IUsersCompaniesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    name,
    password,
    phone,
    email,
    isActive,
    companyIds,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.userNotFound;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;

    if (companyIds) {
      const promises: Promise<UsersCompanies>[] = [];
      companyIds.forEach(companyId => {
        promises.push(
          this.usersCompaniesRepository.create({ userId, companyId }),
        );
      });

      await Promise.all(promises).then(results => {
        logger.info(results);
      });
    }

    logger.info(user);
    user.companies = [];

    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }
}

export default UpdateUserService;
