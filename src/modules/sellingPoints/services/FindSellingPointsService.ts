import { inject, injectable } from 'tsyringe';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';
import ISellingPointsRepository from '../repositories/ISellingPointsRepository';

interface IRequest {
  name?: string;
  companyId: number;
}

@injectable()
class FindSellingPointsService {
  constructor(
    @inject('SellingPointsRepository')
    private sellingPointsRepository: ISellingPointsRepository,
  ) {}

  public async execute({ name, companyId }: IRequest): Promise<SellingPoint[]> {
    const sellingPoints = await this.sellingPointsRepository.find({
      name,
      companyId,
    });

    return sellingPoints;
  }
}

export default FindSellingPointsService;
