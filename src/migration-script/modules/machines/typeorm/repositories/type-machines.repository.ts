// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeMachine from '../entities/type-machine';

class TypeMachinesRepository {
  private ormRepository: Repository<TypeMachine>;

  constructor() {
    this.ormRepository = getRepository(TypeMachine);
  }

  public async find(): Promise<TypeMachine[]> {
    const machines = await this.ormRepository.find({
      relations: ['counters'],
    });

    return machines;
  }

  public async findOne(telemetryId: number): Promise<TypeMachine | undefined> {
    const typeMachine = await this.ormRepository.findOne({
      where: {
        telemetryId,
      },
    });

    return typeMachine;
  }
}

export default TypeMachinesRepository;
