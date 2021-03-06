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
  find(data: FindMachinesDto): Promise<Machine[]>;
  findAndCount(
    data: FindMachinesDto,
  ): Promise<{ machines: Machine[]; count: number }>;
  count(data: FindMachinesDto): Promise<number>;
  machinePerCategory({
    groupIds,
  }: FindMachinesDto): Promise<
    {
      categoryLabel: string;
      totalInStock: number;
      totalInOperation: number;
    }[]
  >;
  machinesInventoryByProduct({
    groupIds,
  }: FindMachinesDto): Promise<
    {
      prizeId: string;
      prizeLabel: string;
      totalPrizes: string;
      count: number;
    }[]
  >;
  save(data: Machine): void;
}
