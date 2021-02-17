import MachineCollectCounter from '../infra/typeorm/entities/MachineCollectCounter';
import MachineCollectCounterPhoto from '../infra/typeorm/entities/MachineCollectCounterPhotos';

export default interface ICreateMachineCollectDTO {
  machineId: number;
  userId: number;
  active: number;
  previousCollectionId?: number;
  machineCollectCounters: MachineCollectCounter[];
  machineCollectCounterPhotos: MachineCollectCounterPhoto[];
}
