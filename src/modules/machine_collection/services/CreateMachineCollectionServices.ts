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
class CreateMachineCollectServices {
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
    const machineCollectionCounterResponse = machineCollectionCounter.map(
      machineCollectCounter =>
        this.machineCollectionCounterRepository.createEntity(
          machineCollectCounter,
        ),
    );

    const machineCollect = await this.machineCollectionRepository.create({
      userId,
      machineId,
      machineCollectionCounter: machineCollectionCounterResponse,
      // TODO
      previousCollectionId: 1,
      // TODO
      active: 1,
    });

    return machineCollect;
  }
}

export default CreateMachineCollectServices;
