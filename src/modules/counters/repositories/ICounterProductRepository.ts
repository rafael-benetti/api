import ICreateCounterProductDTO from '../dtos/ICreateCounterProductDTO';
import CounterProduct from '../infra/typeorm/entities/CounterProduct';

export default interface ICounterProductRepository {
  create(data: ICreateCounterProductDTO): Promise<CounterProduct>;
}
