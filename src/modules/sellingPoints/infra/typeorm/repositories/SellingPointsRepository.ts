import logger from '@config/logger';
import ICreateSellingPointDTO from '@modules/sellingPoints/dtos/ICreateSellingPointDTO';
import IFindByNameDTO from '@modules/sellingPoints/dtos/IFindByNameDTO';
import IFindSellingPointsDTO from '@modules/sellingPoints/dtos/IFindSellingPointsDTO';
import ISellingPointsRepository from '@modules/sellingPoints/repositories/ISellingPointsRepository';
import { getRepository, Like, Repository } from 'typeorm';
import SellingPoint from '../entities/SellingPoint';

class SellingPointRepository implements ISellingPointsRepository {
  private ormRepository: Repository<SellingPoint>;

  constructor() {
    this.ormRepository = getRepository(SellingPoint);
  }

  public async findByName({
    companyIds,
    name,
  }: IFindByNameDTO): Promise<SellingPoint | undefined> {
    const filters = companyIds.map(companyId => {
      return {
        companyId,
        name,
      };
    });

    const sellingPoint = await this.ormRepository.findOne({
      where: filters,
    });

    return sellingPoint;
  }

  public async save(sellingPoint: SellingPoint): Promise<void> {
    await this.ormRepository.save(sellingPoint);
  }

  public async findById(
    sellingPointId: number,
  ): Promise<SellingPoint | undefined> {
    const sellingPoint = await this.ormRepository.findOne({
      where: { id: sellingPointId },
      relations: ['address'],
    });

    return sellingPoint;
  }

  public async find({
    name,
    companyIds,
  }: IFindSellingPointsDTO): Promise<SellingPoint[]> {
    const filters = companyIds.map(companyId => {
      return {
        companyId,
        ...(name && { name: Like(`%${name}%`) }),
      };
    });

    const sellingPoints = await this.ormRepository.find({
      where: filters,
      relations: ['address'],
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
