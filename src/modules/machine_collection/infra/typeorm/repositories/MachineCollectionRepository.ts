import ICreateMachineCollectDTO from '@modules/machine_collection/dtos/ICreateMachineCollectDTO';
import IMachineCollectsRepository from '@modules/machine_collection/repositories/IMachineCollectionRepository';
import { getRepository, Repository } from 'typeorm';
import MachineCollect from '../entities/MachineCollect';

class MachineCollectionRepository implements IMachineCollectsRepository {
  private ormRepository: Repository<MachineCollect>;

  constructor() {
    this.ormRepository = getRepository(MachineCollect);
  }

  public async create({
    active,
    machineCollectionCounter,
    userId,
    previousCollectionId,
  }: ICreateMachineCollectDTO): Promise<MachineCollect> {
    // TODO
    const machineCollect = this.ormRepository.create({
      active,
      collectionDate: Date(),
      userId,
      previousCollectionId,
      machineCollectionCounter,
    });

    await this.ormRepository.save(machineCollect);

    return machineCollect;
  }
}

export default MachineCollectionRepository;
