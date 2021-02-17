import IMachineCollectCounterPhotosRepository from '@modules/machine_collection/repositories/IMachineCollectCounterPhotosRepository';
import { getRepository, Repository } from 'typeorm';
import MachineCollectCounterPhoto from '../entities/MachineCollectCounterPhotos';

class MachineCollectCounterPhotosRepository
  implements IMachineCollectCounterPhotosRepository {
  private ormRepository: Repository<MachineCollectCounterPhoto>;

  constructor() {
    this.ormRepository = getRepository(MachineCollectCounterPhoto);
  }

  public createEntity(photo: string): MachineCollectCounterPhoto {
    const photoEntity = this.ormRepository.create({ photo });

    return photoEntity;
  }
}

export default MachineCollectCounterPhotosRepository;
