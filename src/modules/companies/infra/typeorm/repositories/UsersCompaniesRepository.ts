import ICreateUsersCompaniesDTO from '@modules/companies/dtos/ICreateUsersCompaniesDTO';
import IUsersCompaniesRepository from '@modules/companies/repositories/IUsersCompaniesRepository';
import { getRepository, Repository } from 'typeorm';
import UsersCompanies from '../entities/UsersCompanies';

class UsersCompaniesRepository implements IUsersCompaniesRepository {
  private ormRepository: Repository<UsersCompanies>;

  constructor() {
    this.ormRepository = getRepository(UsersCompanies);
  }

  public async findCompanies(userId: number): Promise<UsersCompanies[]> {
    const usersCompanies = await this.ormRepository.find({
      where: { userId },
      relations: ['company'],
    });

    return usersCompanies;
  }

  public async create({
    companyId,
    userId,
  }: ICreateUsersCompaniesDTO): Promise<UsersCompanies> {
    const usersCompanies = this.ormRepository.create({ companyId, userId });

    await this.ormRepository.save(usersCompanies);

    return usersCompanies;
  }
}

export default UsersCompaniesRepository;
