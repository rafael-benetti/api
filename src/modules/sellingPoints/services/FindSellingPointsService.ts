import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';
import ISellingPointsRepository from '../repositories/ISellingPointsRepository';

interface IRequest {
  name?: string;
  companyId: number;
  userId: number;
}

@injectable()
class FindSellingPointsService {
  constructor(
    @inject('SellingPointsRepository')
    private sellingPointsRepository: ISellingPointsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    name,
    companyId,
  }: IRequest): Promise<SellingPoint[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.userNotFound;
    }

    let companyIds = user.companies.map(company => company.id);

    if (companyId) {
      if (companyIds.includes(companyId)) {
        companyIds = [companyId];
      } else {
        throw AppError.authorizationError;
      }
    }

    const sellingPoints = await this.sellingPointsRepository.find({
      name,
      companyIds,
    });

    return sellingPoints;
  }
}

export default FindSellingPointsService;
