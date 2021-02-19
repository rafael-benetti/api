import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByOwnerId(ownerId: number): Promise<User[]> {
    const users = await this.ormRepository.find({ where: { ownerId } });

    return users;
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await this.ormRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.companies', 'companies')
      .where({ id })
      .getOne();

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
      relations: ['companies'],
    });

    return user;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);
    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;
