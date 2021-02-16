import ICreateMachineDTO from '../dtos/ICreateMachineDTO';
import IFindMachinesDTO from '../dtos/IFindMachinesDTO';
import IFindMachinesResponseDTO from '../dtos/IFindMachinesResponseDTO';
import Machine from '../infra/typeorm/entities/Machine';

export default interface IMachinesRepository {
  create(data: ICreateMachineDTO): Promise<Machine>;
  findById(machineId: number): Promise<Machine | undefined>;
  findMachines(data: IFindMachinesDTO): Promise<IFindMachinesResponseDTO>;
  save(machine: Machine): Promise<void>;
}
