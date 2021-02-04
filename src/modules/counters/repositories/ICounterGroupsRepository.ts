import ICreateCounterGroupsDTO from '../dtos/ICreateCounterGroupsDTO';
import CounterGroup from '../infra/typeorm/entities/CounterGroups';

export default interface ICounterGroupsRepository {
  create(data: ICreateCounterGroupsDTO): Promise<CounterGroup>;
}
