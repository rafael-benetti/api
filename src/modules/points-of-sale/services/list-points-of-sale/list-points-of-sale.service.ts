import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  label: string;
  limit: number;
  offset: number;
}

@injectable()
class ListPointsOfSaleService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({
    userId,
    label,
    groupId,
    limit,
    offset,
  }: Request): Promise<{ count: number; pointsOfSale: PointOfSale[] }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) {
      const response = await this.pointsOfSaleRepository.find({
        by: 'ownerId',
        value: user.id,
        filters: {
          groupId,
          limit,
          label,
          offset,
        },
      });

      return response;
    }

    if (user.groupIds) {
      const response = await this.pointsOfSaleRepository.find({
        by: 'groupId',
        value: user.groupIds,
        filters: {
          label,
          limit,
          offset,
        },
      });
      return response;
    }

    return { count: 0, pointsOfSale: [] };
  }
}
export default ListPointsOfSaleService;
