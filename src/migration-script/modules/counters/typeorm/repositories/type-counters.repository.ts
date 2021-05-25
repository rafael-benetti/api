// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeCounter from '../entities/type-counters';

class TypeCountersRepository {
  private ormRepository: Repository<TypeCounter>;

  constructor() {
    this.ormRepository = getRepository(TypeCounter);
  }

  public async find(): Promise<TypeCounter[]> {
    const counters = await this.ormRepository.find();

    return counters;
  }
}

export default TypeCountersRepository;
