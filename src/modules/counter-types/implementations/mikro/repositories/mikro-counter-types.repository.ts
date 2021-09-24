import CreateCounterTypesDto from '@modules/counter-types/contracts/dtos/create-counter-types.dto';
import FindCounterTypesDto from '@modules/counter-types/contracts/dtos/find-counter-types.dto';
import CounterType from '@modules/counter-types/contracts/models/counter-type';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import CounterTypeMapper from '../mapper/counter-type.mapper';
import MikroCounterType from '../models/mikro-counter-type';

class MikroCounterTypesRepository implements CounterTypesRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroCounterType);

  create(data: CreateCounterTypesDto): CounterType {
    const counterType = new MikroCounterType(data);
    this.repository.persist(counterType);
    return CounterTypeMapper.toEntity(counterType);
  }

  async findOne({
    id,
    label,
    ownerId,
  }: FindCounterTypesDto): Promise<CounterType | undefined> {
    const counterType = await this.repository.findOne({
      ...(id && { id }),
      ...(label && { label }),
      ...(ownerId && { ownerId }),
    });

    return counterType ? CounterTypeMapper.toEntity(counterType) : undefined;
  }

  async find({
    id,
    label,
    ownerId,
  }: FindCounterTypesDto): Promise<CounterType[]> {
    const counterTypes = await this.repository.find({
      ...(id && { id }),
      ...(label && { label }),
      ...(ownerId && { ownerId }),
    });

    return counterTypes.map(counterType =>
      CounterTypeMapper.toEntity(counterType),
    );
  }

  save(data: CounterType): void {
    const reference = this.repository.getReference(data.id);
    const counterType = this.repository.assign(reference, data);
    this.repository.persist(counterType);
  }
}

export default MikroCounterTypesRepository;
