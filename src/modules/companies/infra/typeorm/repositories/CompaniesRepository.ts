import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import IFindCompaniesDTO from '@modules/companies/dtos/IFindCompaniesDTO';
import IFindCompanyByNameDTO from '@modules/companies/dtos/IFindCompanyByNameDTO';
import IUpdateCompanyDTO from '@modules/companies/dtos/IUpdateCompanyDTO';
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import { getRepository, Like, Repository } from 'typeorm';
import Company from '../entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async findById(companyId: number): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({
      where: { id: companyId },
    });

    return company;
  }

  public async save({ id, name }: IUpdateCompanyDTO): Promise<void> {
    await this.ormRepository.update(id, { name });
  }

  public async findCompanies(companyIds: number[]): Promise<Company[]> {
    const companies = await this.ormRepository.find({
      where: companyIds.map(companyId => {
        return { id: companyId };
      }),
    });

    return companies;
  }

  public async findCompaniesByUserId({
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

  public async findByName({
    name,
    ownerId,
  }: IFindCompanyByNameDTO): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({
      where: {
        name,
        ownerId,
      },
    });

    return company;
  }

  public async create({
    name,
    ownerId,
    user,
  }: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create({
      name,
      ownerId,
      users: [user],
    });

    await this.ormRepository.save(company);

    return company;
  }
}

export default CompaniesRepository;
