import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';
import IUsersCompaniesRepository from '../repositories/IUsersCompaniesRepository';

interface IRequest {
  name: string;
  ownerId: number;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,

    @inject('UsersCompaniesRepository')
    private usersCompaniesRepository: IUsersCompaniesRepository,
  ) {}

  public async execute({ name, ownerId }: IRequest): Promise<Company> {
    const checkCompanyName = await this.companiesRepository.findByName(
      name,
      ownerId,
    );

    if (checkCompanyName) {
      throw AppError.nameAlreadyInUsed;
    }

    const company = await this.companiesRepository.create({
      name,
      ownerId,
    });

    await this.usersCompaniesRepository.create({
      userId: ownerId,
      companyId: company.id,
    });

    return company;
  }
}

export default CreateCompanyService;
