import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  name: string;
  userId: number;
}

interface IResponse {
  id: number;
  name: string;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.authorizationError;
    }

    const checkCompanyName = await this.companiesRepository.findByName({
      name,
      ownerId: user.ownerId,
    });

    if (checkCompanyName) {
      throw AppError.nameAlreadyInUsed;
    }

    const company = await this.companiesRepository.create({
      name,
      ownerId: user.ownerId,
      user,
    });

    return {
      id: company.id,
      name: company.name,
    };
  }
}

export default CreateCompanyService;
