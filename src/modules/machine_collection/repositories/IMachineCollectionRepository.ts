import ICreateMachineCollectDTO from '../dtos/ICreateMachineCollectDTO';
import MachineCollect from '../infra/typeorm/entities/MachineCollect';

export default interface IMachineCollectsRepository {
  create(data: ICreateMachineCollectDTO): Promise<MachineCollect>;
}
