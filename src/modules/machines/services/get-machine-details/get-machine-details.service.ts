import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineId: string;
}

interface Response {}

@injectable()
class GetMachineDetailsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ userId, machineId }: Request): Promise<Machine> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (user.role === Role.OWNER && machine.ownerId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER && !user.groupIds?.includes(machine.groupId))
      throw AppError.authorizationError;

    // TODO: ULTIMA COMUNICAÇÃO

    // TODO: ULTIMA COLETA

    // TODO: FATURAMENTO

    // TODO: PREMIOS ENTREGUES

    // TODO: INFORMAÇÕES DO GRAFICO SENDO ELAS: DIARIO(24HRS), SEMANAL(ULTIMAS 7 DIAS) E MENSAL(ULTIMOS 30 DIAS)

    // TODO: CREDITOS DISPONIVEIS POR GABINE

    // TODO: TOTAL DE PREMIOS NAS GABINES DE SAIDA

    // TODO: ESTOQUE NAS GABINES

    // TODO: HISTORICO DE EVENTOS
  }
}
export default GetMachineDetailsService;
