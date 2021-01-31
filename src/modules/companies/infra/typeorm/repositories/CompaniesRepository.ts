import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import { getRepository, Repository } from 'typeorm';
import Company from '../entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async findAllCompanies(ownerId: string): Promise<Company[]> {
    const companies = await this.ormRepository.find({
      where: {
        ownerId,
      },
    });
    return companies;
  }

  public async findByName(
    name: string,
    ownerId: number,
  ): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({
      where: {
        name,
        ownerId,
      },
    });

    return company;
  }

  public async create({ name, ownerId }: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create({
      name,
      ownerId,
    });
    await this.ormRepository.save(company);
    return company;
  }
}

export default CompaniesRepository;
