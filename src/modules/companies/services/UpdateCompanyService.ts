import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  id: number;
  name: string;
  userId: number;
}

@injectable()
class UpdateCompaniesService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ id, name, userId }: IRequest): Promise<Company> {
    const company = await this.companiesRepository.findById(id);

    if (!company) {
      throw AppError.authorizationError;
    }

    const checkCompanyName = await this.companiesRepository.findByName({
      name,
      ownerId: userId,
    });

    if (checkCompanyName) {
      if (checkCompanyName.id !== id) {
        throw AppError.nameAlreadyInUsed;
      }
    }

    if (name) company.name = name;

    await this.companiesRepository.save(company);

    return company;
  }
}

export default UpdateCompaniesService;
