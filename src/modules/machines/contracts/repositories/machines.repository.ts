import CreateMachineDto from '../dtos/create-machine.dto';
import FindMachineDto from '../dtos/find-machine.dto';
import FindMachinesDto from '../dtos/find-machines.dto';
import Machine from '../models/machine';

export default interface MachinesRepository {
  create(data: CreateMachineDto): Machine;
  machineSortedByStock(
    data: FindMachinesDto,
  ): Promise<
    {
      id: string;
      serialNumber: string;
      total: number;
      minimumPrizeCount: number;
    }[]
  >;
  findOne(data: FindMachineDto): Promise<Machine | undefined>;
  find(data: FindMachinesDto): Promise<{ machines: Machine[]; count: number }>;
  count(data: FindMachinesDto): Promise<number>;
  save(data: Machine): void;
}
