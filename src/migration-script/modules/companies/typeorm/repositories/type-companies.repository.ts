// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeCompany from '../entities/type-company';

class TypeCompaniesRepository {
  private ormRepository: Repository<TypeCompany>;

  constructor() {
    this.ormRepository = getRepository(TypeCompany);
  }

  public async findByOwnerId(ownerId: number): Promise<TypeCompany[]> {
    this.ormRepository = getRepository<TypeCompany>(TypeCompany);

    const companies = await this.ormRepository.find({ where: { ownerId } });

    return companies;
  }

  public async find(ownerId?: string): Promise<TypeCompany[]> {
    if (ownerId) {
      const companies = await this.ormRepository.find({
        where: ownerId,
      });
      return companies;
    }

    const companies = await this.ormRepository.find();
    return companies;
  }
}

export default TypeCompaniesRepository;
