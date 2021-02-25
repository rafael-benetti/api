import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
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
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
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

    // TODO: VERIFICAR PERMISSÕES

    if (!user) {
      throw AppError.userNotFound;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;

    if (companyIds && companyIds.length >= 1) {
      const companies = await this.companiesRepository.findCompanies(
        companyIds,
      );
      user.companies = companies;
    } else {
      user.companies = [];
    }

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default UpdateUserService;
