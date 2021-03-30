import logger from '@config/logger';
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
    label,
  }: FindCounterTypesDto): Promise<CounterType | undefined> {
    const counterType = await this.repository.findOne({
      label,
    });

    return counterType ? CounterTypeMapper.toEntity(counterType) : undefined;
  }

  async find({ label, ownerId }: FindCounterTypesDto): Promise<CounterType[]> {
    logger.info(ownerId);

    const counterTypes = await this.repository.find({
      ...(label && { label }),
      ...(ownerId && { ownerId }),
    });
    logger.info(counterTypes);

    return counterTypes.map(counterType =>
      CounterTypeMapper.toEntity(counterType),
    );
  }

  save(data: CounterType): void {
    this.repository.persist(CounterTypeMapper.toMikroEntity(data));
  }
}

export default MikroCounterTypesRepository;
