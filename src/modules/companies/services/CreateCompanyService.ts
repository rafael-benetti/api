import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  name: string;
  ownerId: number;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ name, ownerId }: IRequest): Promise<Company> {
    const checkCompanyName = await this.companiesRepository.findByName(
      name,
      ownerId,
    );

    if (checkCompanyName) {
      throw AppError.nameAlreadyInUsed;
    }

    const company = this.companiesRepository.create({
      name,
      ownerId,
    });

    return company;
  }
}

export default CreateCompanyService;
