import logger from '@config/logger';
import ICreateMachineCollectDTO from '@modules/machine_collection/dtos/ICreateMachineCollectDTO';
import IFindMachineCollectionDTO from '@modules/machine_collection/dtos/IFindMachineCollectionDTO';
import IMachineCollectsRepository from '@modules/machine_collection/repositories/IMachineCollectionRepository';
import { getRepository, Repository } from 'typeorm';
import MachineCollect from '../entities/MachineCollect';

class MachineCollectionRepository implements IMachineCollectsRepository {
  private ormRepository: Repository<MachineCollect>;

  constructor() {
    this.ormRepository = getRepository(MachineCollect);
  }

  public async findMachineCollection({
    keywords,
    machineIds,
  }: IFindMachineCollectionDTO): Promise<MachineCollect[]> {
    const machineIdsFilter = machineIds.map(machineId => {
      return {
        machineId,
      };
    });

    const machineCollection = await this.ormRepository
      .createQueryBuilder('machine_collection')
      .leftJoinAndSelect('machine_collection.machine', 'machines')
      .whereInIds(machineIdsFilter)
      .orWhere('machines.serial_number like :id ', {
        id: `%${keywords}%`,
      })
      .orWhere('machines.description like :id', {
        id: `%${keywords}%`,
      })
      .getMany();

    return machineCollection;
  }

  public async findLastCollect(
    machineId: number,
  ): Promise<MachineCollect | undefined> {
    const machineCollect = await this.ormRepository.findOne({
      where: { machineId },
      order: { collectionDate: 'DESC' },
    });

    return machineCollect;
  }

  public async create({
    active,
    machineCollectionCounter,
    userId,
    previousCollectionId,
    machineId,
  }: ICreateMachineCollectDTO): Promise<MachineCollect> {
    // TODO

    logger.info(previousCollectionId);
    const machineCollect = this.ormRepository.create({
      active,
      collectionDate: Date(),
      userId,
      previousCollectionId,
      machineCollectionCounter,
      machineId,
    });

    await this.ormRepository.save(machineCollect);

    return machineCollect;
  }
}

export default MachineCollectionRepository;
