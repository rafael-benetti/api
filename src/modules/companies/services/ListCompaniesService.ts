import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

@injectable()
class ListCompaniesService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute(ownerId: string): Promise<Company[]> {
    const companies = this.companiesRepository.findAllCompanies(ownerId);

    return companies;
  }
}

export default ListCompaniesService;
