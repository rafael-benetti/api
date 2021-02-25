import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import MachineCollect from '../infra/typeorm/entities/MachineCollect';
import MachineCollectCounter from '../infra/typeorm/entities/MachineCollectCounter';
import IMachineCollectCounterPhotosRepository from '../repositories/IMachineCollectCounterPhotosRepository';
import IMachineCollectCounterRepository from '../repositories/IMachineCollectCounterRepository';
import IMachineCollectionRepository from '../repositories/IMachineCollectionRepository';

interface IRequest {
  userId: number;
  machineId: number;
  machineCollectCounters: MachineCollectCounter[];
  machineCollectCounterPhotos: string[];
}

@injectable()
class CreateMachineCollectService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,

    @inject('MachineCollectionRepository')
    private machineCollectionRepository: IMachineCollectionRepository,

    @inject('MachineCollectionCounterRepository')
    private machineCollectionCounterRepository: IMachineCollectCounterRepository,

    @inject('MachineCollectCounterPhotosRepository')
    private machineCollectCounterPhotosRepository: IMachineCollectCounterPhotosRepository,
  ) {}

  public async execute({
    userId,
    machineId,
    machineCollectCounters,
    machineCollectCounterPhotos,
  }: IRequest): Promise<MachineCollect> {
    const machine = await this.machinesRepository.findById(machineId);

    if (!machine) {
      throw AppError.machineNotFound;
    }

    const machineCollectionCounterEntities = machineCollectCounters.map(
      machineCollectCounter =>
        this.machineCollectionCounterRepository.createEntity(
          machineCollectCounter,
        ),
    );

    const machineCollectionCounterPhotoEntities = machineCollectCounterPhotos.map(
      machineCollectCounterPhoto =>
        this.machineCollectCounterPhotosRepository.createEntity(
          machineCollectCounterPhoto,
        ),
    );

    const lastCollection = await this.machineCollectionRepository.findLastCollect(
      machineId,
    );

    const machineCollect = await this.machineCollectionRepository.create({
      userId,
      machineId,
      machineCollectCounters: machineCollectionCounterEntities,
      active: 1,
      machineCollectCounterPhotos: machineCollectionCounterPhotoEntities,
      previousCollectionId: lastCollection?.id,
    });

    machine.lastCollection = machineCollect.collectionDate;

    await this.machinesRepository.save(machine);

    return machineCollect;
  }
}

export default CreateMachineCollectService;
