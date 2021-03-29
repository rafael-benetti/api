import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Type from '@modules/machines/contracts/enums/counter-type';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import CounterType from '@modules/counter-types/contracts/models/counter-type';

interface Request {
  userId: string;
  label: string;
  type: Type;
}

@injectable()
class CreateCounterTypeService {
  constructor(
    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ userId, label, type }: Request): Promise<CounterType> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER)
      if (!user.permissions?.editMachines) throw AppError.authorizationError;

    const checkCounterTypeExists = await this.counterTypesRepository.findOne({
      label,
    });

    if (checkCounterTypeExists) throw AppError.labelAlreadyInUsed;

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const counterType = this.counterTypesRepository.create({
      label,
      type,
      ownerId,
    });

    await this.ormProvider.commit();

    return counterType;
  }
}
export default CreateCounterTypeService;
