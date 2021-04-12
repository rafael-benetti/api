import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  pointOfSaleId: string;
}

interface Response {}

@injectable()
class GetPointOfSaleDetailsService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
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
    });

    // TODO: ADICIONAR INFORMAÇÕES REFERENTES A FATURAMENTO DO MES DA MAGUINE

    // TODO: RETORNAR INFORMAÇÕES REFERENTES AO HISTORICO DE 6 MESES DE FUNCIONAMENTO DA MAGUINE
  }
}
export default GetPointOfSaleDetailsService;
