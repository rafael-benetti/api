// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeUser from '../entities/type-user';

class TypeUsersRepository {
  private ormRepository: Repository<TypeUser>;

  constructor() {
    this.ormRepository = getRepository(TypeUser);
  }

  public async findByOwnerId(ownerId: number): Promise<TypeUser[]> {
    this.ormRepository = getRepository<TypeUser>(TypeUser);

    const users = await this.ormRepository.find({ where: { ownerId } });

    return users;
  }

  public async find(): Promise<TypeUser[]> {
    const users = await this.ormRepository.find({
      relations: ['companies'],
    });

    return users;
  }

  public async findById(id: number): Promise<TypeUser | undefined> {
    const user = await this.ormRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.companies', 'companies')
      .where({ id })
      .getOne();

    return user;
  }

  public async findByEmail(email: string): Promise<TypeUser | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
      relations: ['companies'],
    });

    return user;
  }
}

export default TypeUsersRepository;
