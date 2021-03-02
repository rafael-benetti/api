import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
}

@injectable()
class ListPointsOfSaleService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,
  ) {}

  public async execute({ userId }: Request): Promise<PointOfSale[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.MANAGER) {
      if (user.groupIds) {
        const pointsOfSale = await this.pointsOfSaleRepository.findByGroupIds(
          user.groupIds,
        );
        return pointsOfSale;
      }
    }

    if (user.role === Role.OWNER) {
      const pointsOfSale = await this.pointsOfSaleRepository.findByOwnerId(
        user._id,
      );

      return pointsOfSale;
    }

    return [];
  }
}
export default ListPointsOfSaleService;
