import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRespository: IUsersRepository,
  ) {}

  public async execute(id: number): Promise<User | undefined> {
    const user = await this.usersRespository.findById(id);
    return user;
  }
}

export default ShowUserService;
