import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import IFindCompaniesDTO from '@modules/companies/dtos/IFindCompaniesDTO';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import { getRepository, Like, Repository } from 'typeorm';
import Company from '../entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async findCompanies({
    ownerId,
    name,
  }: IFindCompaniesDTO): Promise<Company[]> {
    const companies = await this.ormRepository.find({
      where: {
        ownerId,
        ...(name && { name: Like(`%${name}%`) }),
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
