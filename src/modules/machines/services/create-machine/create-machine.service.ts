import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  categoryId: string;
  groupId: string;
  pointOfSaleId?: string;
  serialNumber: string;
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    serialNumber,
    categoryId,
    groupId,
    pointOfSaleId,
    userId,
  }: Request): Promise<Machine> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.createMachines)
          throw AppError.authorizationError;

        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
    }

    // TODO: Adicionar verificação de serial number

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.authorizationError;

    const machine = this.machinesRepository.create({
      categoryId,
      groupId,
      ownerId,
      serialNumber,
      pointOfSaleId,
    });

    await this.ormProvider.commit();

    return machine;
  }
}
export default CreateMachineService;
