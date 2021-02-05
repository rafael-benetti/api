import ICreateMachineDTO from '../dtos/ICreateMachineDTO';
import IListMachinesDTO from '../dtos/IListMachinesDTO';
import Machine from '../infra/typeorm/entities/Machine';

export default interface IMachinesRepository {
  create(data: ICreateMachineDTO): Promise<Machine>;
  findMachines(data: IListMachinesDTO): Promise<Machine[]>;
}
