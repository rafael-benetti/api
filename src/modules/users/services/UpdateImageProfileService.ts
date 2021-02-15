import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class UpdateImageProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  // public async execute()
}

export default UpdateImageProfileService;
