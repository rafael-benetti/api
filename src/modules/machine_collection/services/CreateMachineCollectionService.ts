import logger from '@config/logger';
import { inject, injectable } from 'tsyringe';
import MachineCollect from '../infra/typeorm/entities/MachineCollect';
import MachineCollectCounter from '../infra/typeorm/entities/MachineCollectCounter';
import IMachineCollectionCounterRepository from '../repositories/IMachineCollectionCounterRepository';
import IMachineCollectionRepository from '../repositories/IMachineCollectionRepository';

interface IRequest {
  userId: number;
  machineId: number;
  machineCollectionCounter: MachineCollectCounter[];
}

@injectable()
class CreateMachineCollectService {
  constructor(
    @inject('MachineCollectionRepository')
    private machineCollectionRepository: IMachineCollectionRepository,

    @inject('MachineCollectionCounterRepository')
    private machineCollectionCounterRepository: IMachineCollectionCounterRepository,
  ) {}

  public async execute({
    userId,
    machineId,
    machineCollectionCounter,
  }: IRequest): Promise<MachineCollect> {
    const machineCollectionCounterEntities = machineCollectionCounter.map(
      machineCollectCounter =>
        this.machineCollectionCounterRepository.createEntity(
          machineCollectCounter,
        ),
    );

    const lastCollection = await this.machineCollectionRepository.findLastCollect(
      machineId,
    );

    logger.info(lastCollection);

    const machineCollect = await this.machineCollectionRepository.create({
      userId,
      machineId,
      machineCollectionCounter: machineCollectionCounterEntities,
      previousCollectionId: lastCollection?.id || undefined,
      // TODO
      active: 1,
    });

    return machineCollect;
  }
}

export default CreateMachineCollectService;
