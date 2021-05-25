// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeGift from '../entities/gift';

class TypeGiftsRepository {
  private ormRepository: Repository<TypeGift>;

  constructor() {
    this.ormRepository = getRepository(TypeGift);
  }

  public async find(): Promise<TypeGift[]> {
    const gifts = await this.ormRepository.find();
    return gifts;
  }
}

export default TypeGiftsRepository;
