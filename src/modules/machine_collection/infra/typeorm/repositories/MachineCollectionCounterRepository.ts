import ICreateMachineCollectCounterDTO from '@modules/machine_collection/dtos/ICreateMachineCollectCounterDTO';
import IMachineCollectionCounterRepository from '@modules/machine_collection/repositories/IMachineCollectionCounterRepository';
import { getRepository, Repository } from 'typeorm';

import MachineCollectCounter from '../entities/MachineCollectCounter';

class MachineCollectionCounterRepository
  implements IMachineCollectionCounterRepository {
  private ormRepository: Repository<MachineCollectCounter>;

  constructor() {
    this.ormRepository = getRepository(MachineCollectCounter);
  }

  createEntity(data: ICreateMachineCollectCounterDTO): MachineCollectCounter {
    const machineCollectCounter = this.ormRepository.create(data);

    return machineCollectCounter;
  }
}

export default MachineCollectionCounterRepository;
