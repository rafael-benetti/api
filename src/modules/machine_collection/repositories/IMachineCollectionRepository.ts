import ICreateMachineCollectDTO from '../dtos/ICreateMachineCollectDTO';
import IFindMachineCollectionDTO from '../dtos/IFindMachineCollectionDTO';
import MachineCollect from '../infra/typeorm/entities/MachineCollect';

export default interface IMachineCollectionRepository {
  create(data: ICreateMachineCollectDTO): Promise<MachineCollect>;
  findLastCollect(machineId: number): Promise<MachineCollect | undefined>;
  findMachineCollection(
    data: IFindMachineCollectionDTO,
  ): Promise<MachineCollect[]>;
}
