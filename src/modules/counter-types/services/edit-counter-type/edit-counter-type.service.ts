import CounterType from '@modules/counter-types/contracts/models/counter-type';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  counterTypeId: string;
  label: string;
}

@injectable()
class EditCounterTypeService {
  constructor(
    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    counterTypeId,
    label,
  }: Request): Promise<CounterType> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    const counterType = await this.counterTypesRepository.findOne({
      id: counterTypeId,
    });

    if (!counterType) throw AppError.counterTypeNotFound;

    const ownerId = user.role === Role.MANAGER ? user.ownerId : user.id;

    const checkLabelAlreadyExist = await this.counterTypesRepository.findOne({
      label,
      ownerId,
    });

    if (checkLabelAlreadyExist && checkLabelAlreadyExist.id !== counterType.id)
      throw AppError.labelAlreadyInUsed;

    counterType.label = label;

    this.counterTypesRepository.save(counterType);

    await this.ormProvider.commit();

    return counterType;
  }
}
export default EditCounterTypeService;
