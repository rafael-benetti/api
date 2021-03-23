import CreateMachineDto from '../dtos/create-machine.dto';
import FindMachineDto from '../dtos/find-machine.dto';
import FindMachinesDto from '../dtos/find-machines.dto';
import Machine from '../models/machine';

export default interface MachinesRepository {
  create(data: CreateMachineDto): Machine;
  findOne(data: FindMachineDto): Promise<Machine | undefined>;
  find(data: FindMachinesDto): Promise<{ machines: Machine[]; count: number }>;
  save(data: Machine): void;
}
