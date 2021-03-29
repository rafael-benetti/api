import CounterType from '@modules/counter-types/contracts/models/counter-type';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
}

@injectable()
class ListCounterTypesService {
  constructor(
    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({ userId }: Request): Promise<CounterType[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const counterTypes = await this.counterTypesRepository.find({
      ownerId,
    });

    return counterTypes;
  }
}
export default ListCounterTypesService;
