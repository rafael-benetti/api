import ICreateMachineCollectCounterDTO from '../dtos/ICreateMachineCollectCounterDTO';
import MachineCollectCounter from '../infra/typeorm/entities/MachineCollectCounter';

export default interface IMachineCollectionRepository {
  createEntity(data: ICreateMachineCollectCounterDTO): MachineCollectCounter;
}
