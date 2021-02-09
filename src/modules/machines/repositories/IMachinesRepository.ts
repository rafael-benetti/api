import ICreateMachineDTO from '../dtos/ICreateMachineDTO';
import IListMachinesDTO from '../dtos/IListMachinesDTO';
import Machine from '../infra/typeorm/entities/Machine';

export default interface IMachinesRepository {
  create(data: ICreateMachineDTO): Promise<Machine>;
  findById(machineId: number): Promise<Machine | undefined>;
  findMachines(data: IListMachinesDTO): Promise<Machine[]>;
  save(machine: Machine): Promise<void>;
}
