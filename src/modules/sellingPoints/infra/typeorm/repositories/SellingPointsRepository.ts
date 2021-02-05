import logger from '@config/logger';
import ICreateSellingPointDTO from '@modules/sellingPoints/dtos/ICreateSellingPointDTO';
import IFindSellingPointsDTO from '@modules/sellingPoints/dtos/IFindSellingPointsDTO';
import ISellingPointsRepository from '@modules/sellingPoints/repositories/ISellingPointsRepository';
import { getRepository, Like, Repository } from 'typeorm';
import SellingPoint from '../entities/SellingPoint';

class SellingPointRepository implements ISellingPointsRepository {
  private ormRepository: Repository<SellingPoint>;

  constructor() {
    this.ormRepository = getRepository(SellingPoint);
  }

  public async find({
    name,
    companyId,
  }: IFindSellingPointsDTO): Promise<SellingPoint[]> {
    logger.info(name, companyId);

    const sellingPoints = await this.ormRepository.find({
      where: { companyId, ...(name && { name: Like(`%${name}%`) }) },
    });

    return sellingPoints;
  }

  public async create(data: ICreateSellingPointDTO): Promise<SellingPoint> {
    const sellingPoint = this.ormRepository.create(data);

    await this.ormRepository.save(sellingPoint);

    return sellingPoint;
  }
}

export default SellingPointRepository;
