import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import FindMachineDto from '@modules/machines/contracts/dtos/find-machine.dto';
import FindMachinesDto from '@modules/machines/contracts/dtos/find-machines.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';

export default class FakeMachinesRepository implements MachinesRepository {
  private machines: Machine[] = [];

  create(data: CreateMachineDto): Machine {
    const machine = new Machine(data);
    this.machines.push(machine);
    return machine;
  }

  async findOne(data: FindMachineDto): Promise<Machine | undefined> {
    return this.machines.find(machine => machine[data.by] === data.value);
  }

  async find(data: FindMachinesDto): Promise<Machine[]> {
    const { categoryId, groupId, ownerId, pointOfSaleId } = data.filters;

    return this.machines
      .filter(
        machine =>
          (categoryId ? machine.categoryId === categoryId : true) &&
          (groupId ? machine.groupId === groupId : true) &&
          (ownerId ? machine.ownerId === ownerId : true) &&
          (pointOfSaleId ? machine.pointOfSaleId === pointOfSaleId : true),
      )
      .slice(data.offset || 0, (data.offset || 0) + (data.limit || 0));
  }

  save(data: Machine): void {
    const index = this.machines.findIndex(machine => machine._id === data._id);
    this.machines[index] = data;
  }

  delete(data: Machine): void {
    const index = this.machines.indexOf(data);
    this.machines.splice(index, 1);
  }
}
