import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  ownerId: number;
  name?: string;
}

@injectable()
class ListCompaniesService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ ownerId, name }: IRequest): Promise<Company[]> {
    const companies = await this.companiesRepository.findCompanies({
      ownerId,
      name,
    });

    return companies;
  }
}

export default ListCompaniesService;
