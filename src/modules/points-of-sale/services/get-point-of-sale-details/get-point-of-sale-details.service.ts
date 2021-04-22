import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { startOfMonth } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  pointOfSaleId: string;
}

interface MachineInfo {
  machine: Machine;
  income: number;
}

interface Response {
  machines: MachineInfo[];
  route?: Route;
}

@injectable()
class GetPointOfSaleDetailsService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,
  ) {}

  public async execute({ userId, pointOfSaleId }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: pointOfSaleId,
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    if (user.role === Role.OWNER && user.id !== pointOfSale.ownerId)
      throw AppError.authorizationError;

    if (
      (user.role === Role.MANAGER || user.role === Role.OPERATOR) &&
      !user.groupIds?.includes(pointOfSale.groupId)
    )
      throw AppError.authorizationError;

    const { machines } = await this.machinesRepository.find({
      pointOfSaleId,
      populate: ['telemetryBoard'],
    });

    let route;
    if (pointOfSale.routeId) {
      route = await this.routesRepository.findOne({
        id: pointOfSale.routeId,
      });
    }

    const machinesInfos: MachineInfo[] = machines.map(machine => {
      return {
        machine,
        income: machine.boxes.reduce((a, b) => a + b.currentMoney, 0),
      };
    });

    return {
      machines: machinesInfos,
      route,
    };
  }
}
export default GetPointOfSaleDetailsService;
