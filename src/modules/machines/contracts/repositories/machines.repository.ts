import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateMachineDto from '../dtos/create-machine.dto';
import Machine from '../models/machine';

export default interface MachinesRepository {
  create(data: CreateMachineDto): Machine;
  findOne(data: FindEntityDto<Machine>): Promise<Machine | undefined>;
  find(data: FindEntityDto<Machine>): Promise<Machine[]>;
  save(data: Machine): void;
  delete(data: Machine): void;
}
