import ICreateCounterProductDTO from '@modules/counters/dtos/ICreateCounterProductDTO';
import ICounterProductRepository from '@modules/counters/repositories/ICounterProductRepository';
import { getRepository, Repository } from 'typeorm';
import CounterProduct from '../entities/CounterProduct';

class CounterProductRepository implements ICounterProductRepository {
  private ormRepository: Repository<CounterProduct>;

  constructor() {
    this.ormRepository = getRepository(CounterProduct);
  }

  public async create(data: ICreateCounterProductDTO): Promise<CounterProduct> {
    const counterProduct = this.ormRepository.create(data);

    await this.ormRepository.save(counterProduct);

    return counterProduct;
  }
}

export default CounterProductRepository;
