import logger from '@config/logger';
import ICreateMachineDTO from '@modules/machines/dtos/ICreateMachineDTO';
import IFindMachinesDTO from '@modules/machines/dtos/IFindMachinesDTO';
import IFindMachinesResponseDTO from '@modules/machines/dtos/IFindMachinesResponseDTO';
import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import { getRepository, Like, Repository } from 'typeorm';
import Machine from '../entities/Machine';

class MachinesRepository implements IMachinesRepository {
  private ormRepository: Repository<Machine>;

  constructor() {
    this.ormRepository = getRepository(Machine);
  }

  public async save(machine: Machine): Promise<void> {
    await this.ormRepository.save(machine);
  }

  public async findById(machineId: number): Promise<Machine | undefined> {
    const machine = this.ormRepository.findOne({
      where: { id: machineId },
      relations: ['counters', 'machineCategory'],
    });

    return machine;
  }

  public async findMachines({
    companyIds,
    active,
    keywords,
    limit,
    page,
    machineCategoryId,
  }: IFindMachinesDTO): Promise<IFindMachinesResponseDTO> {
    const filters = companyIds.flatMap(companyId => {
      if (keywords) {
        return [
          {
            companyId,
            ...(machineCategoryId && { machineCategoryId }),
            ...(active !== undefined && { active }),
            ...(keywords && { description: Like(`%${keywords}%`) }),
          },
          {
            companyId,
            ...(machineCategoryId && { machineCategoryId }),
            ...(active !== undefined && { active }),
            ...(keywords && { serialNumber: Like(`%${keywords}%`) }),
          },
        ];
      }
      return [
        {
          companyId,
          ...(machineCategoryId && { machineCategoryId }),
          ...(active !== undefined && { active }),
        },
      ];
    });

    logger.info(filters);

    const [machines, machinesCount] = await this.ormRepository.findAndCount({
      where: filters,
      take: limit,
      skip: page ? limit || 0 * page : undefined,
      relations: ['counters', 'company', 'machineCategory'],
    });

    return { machinesCount, machines };
  }

  public async create({
    description,
    gameValue,
    registrationDate,
    serialNumber,
    companyId,
    sellingPointId,
    counters,
    machineCategoryId,
  }: ICreateMachineDTO): Promise<Machine> {
    const machine = this.ormRepository.create({
      description,
      gameValue,
      registrationDate,
      serialNumber,
      companyId,
      sellingPointId,
      counters,
      machineCategoryId,
    });

    await this.ormRepository.save(machine);

    return machine;
  }
}

export default MachinesRepository;
