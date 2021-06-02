/* eslint-disable import/no-extraneous-dependencies */
import { getRepository, Repository } from 'typeorm';
import TypeSellingPoint from '../entities/type-selling-point';

class TypeSellingPointsRepository {
  private ormRepository: Repository<TypeSellingPoint>;

  constructor() {
    this.ormRepository = getRepository(TypeSellingPoint);
  }

  public async findById(
    sellingPointId: number,
  ): Promise<TypeSellingPoint | undefined> {
    const sellingPoint = await this.ormRepository.findOne({
      where: { id: sellingPointId },
      relations: ['address'],
    });

    return sellingPoint;
  }

  public async find(): Promise<TypeSellingPoint[]> {
    const sellingPoints = await this.ormRepository.find({
      relations: ['address'],
    });

    return sellingPoints;
  }
}

export default TypeSellingPointsRepository;
