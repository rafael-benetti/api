// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeMachineCollect from '../entities/type-machine-collect';

class TypeMachineCollectRepository {
  private ormRepository: Repository<TypeMachineCollect>;

  constructor() {
    this.ormRepository = getRepository(TypeMachineCollect);
  }

  public async find(): Promise<TypeMachineCollect[]> {
    const machineCollects = await this.ormRepository.find({
      relations: ['counters', 'counters.photos'],
    });

    return machineCollects;
  }
}

export default TypeMachineCollectRepository;
