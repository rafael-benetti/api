import CreateMachineDto from '../dtos/create-machine.dto';
import FindMachineDto from '../dtos/find-machine.dto';
import Machine from '../models/machine';

export default interface MachinesRepository {
  create(data: CreateMachineDto): Machine;
  findOne(data: FindMachineDto): Promise<Machine | undefined>;
  find(data: FindMachineDto): Promise<Machine[]>;
  save(data: Machine): void;
  delete(data: Machine): void;
}
