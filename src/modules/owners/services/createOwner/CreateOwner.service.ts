import { injectable, inject } from 'tsyringe';
import IOrmProvider from 'providers/orm-provider/contracts/models/IOrmProvider';
import IOwnersRepository from '../../contracts/repositories/IOwnersRepository';
import Owner from '../../contracts/models/Owner';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateOwnerService {
  constructor(
    @inject('OwnersRepository')
    private ownersRepository: IOwnersRepository,

    @inject('OrmProvider')
    private ormProvider: IOrmProvider,
  ) {}

  public async execute({ email, name, password }: IRequest): Promise<Owner> {
    const owner = this.ownersRepository.create({
      name,
      email,
      password,
      isActive: true,
    });

    const [savedOwner] = await this.ormProvider.save([owner]);

    return savedOwner as Owner;
  }
}
export default CreateOwnerService;
