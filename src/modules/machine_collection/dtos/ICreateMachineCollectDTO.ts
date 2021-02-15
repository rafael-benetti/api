import MachineCollectCounter from '../infra/typeorm/entities/MachineCollectCounter';

export default interface ICreateMachineCollectDTO {
  machineId: number;
  userId: number;
  active: number;
  previousCollectionId?: number;
  machineCollectionCounter: MachineCollectCounter[];
}
