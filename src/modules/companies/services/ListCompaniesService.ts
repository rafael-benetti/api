import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

@injectable()
class ListCompaniesService {
  constructor(
    @inject('CompaniesRepository')
    private companyRepository: ICompaniesRepository,
  ) {}

  public async execute(): Promise<Company[]> {
    const companies = await this.companyRepository.findCompanies([]);

    return companies;
  }
}

export default ListCompaniesService;
