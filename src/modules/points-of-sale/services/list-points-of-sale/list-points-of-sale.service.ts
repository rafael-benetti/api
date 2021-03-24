import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListPointsOfSaleService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute(userId: string): Promise<PointOfSale[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) {
      const pointsOfSale = await this.pointsOfSaleRepository.find({
        by: 'ownerId',
        value: user.id,
      });

      return pointsOfSale;
    }

    if (user.groupIds) {
      const pointsOfSale = await this.pointsOfSaleRepository.findByGroupIds(
        user.groupIds,
      );
      return pointsOfSale;
    }

    return [];
  }
}
export default ListPointsOfSaleService;
