import ICreateMachineDTO from '@modules/machines/dtos/ICreateMachineDTO';
import IListMachinesDTO from '@modules/machines/dtos/IListMachinesDTO';
import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import { getRepository, Like, Repository } from 'typeorm';
import Machine from '../entities/Machine';

class MachinesRepository implements IMachinesRepository {
  private ormRepository: Repository<Machine>;

  constructor() {
    this.ormRepository = getRepository(Machine);
  }

  public async listMachines({
    companyIds,
    active,
    name,
    limit,
    page,
  }: IListMachinesDTO): Promise<Machine[]> {
    const filters = companyIds.map(companyId => {
      return {
        companyId,
        ...(active !== undefined && { active }),
        ...(name && { serialNumber: Like(`%${name}%`) }),
      };
    });

    const machines = await this.ormRepository.find({
      where: filters,
      take: limit,
      skip: limit * page,
    });

    return machines;
  }

  public async create({
    description,
    gameValue,
    registrationDate,
    serialNumber,
    companyId,
  }: ICreateMachineDTO): Promise<Machine> {
    const machine = this.ormRepository.create({
      description,
      gameValue,
      registrationDate,
      serialNumber,
      companyId,
    });

    await this.ormRepository.save(machine);

    return machine;
  }
}

export default MachinesRepository;
