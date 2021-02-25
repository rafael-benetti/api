import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/app-error';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import Company from '@modules/companies/infra/typeorm/entities/Company';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive: number;
  roles: string;
  isOperator: number;
  picture: string;
  userId: number;
  companyIds: number[];
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
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
    companyIds,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) throw AppError.emailAlreadyUsed;

    let companies: Company[] = [];

    if (companyIds && companyIds.length >= 1) {
      companies = await this.companiesRepository.findCompanies(companyIds);
    }

    const newUser = await this.usersRepository.create({
      ownerId: user.ownerId,
      name,
      email,
      username: email,
      roles,
      picture,
      phone,
      password,
      isOperator,
      isActive,
      companies,
    });

    return newUser;
  }
}

export default CreateUserService;
