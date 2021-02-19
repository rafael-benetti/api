import logger from '@config/logger';
import ICreateMachineDTO from '@modules/machines/dtos/ICreateMachineDTO';
import IFindMachinesDTO from '@modules/machines/dtos/IFindMachinesDTO';
import IFindMachinesResponseDTO from '@modules/machines/dtos/IFindMachinesResponseDTO';
import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import { Brackets, getRepository, Repository } from 'typeorm';
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
    const companyIdsFilter = companyIds.map(companyId => {
      return { companyId };
    });

    logger.info(companyIdsFilter);

    const queryMachines = this.ormRepository
      .createQueryBuilder('machines')
      .leftJoinAndSelect('machines.counters', 'counters')
      .leftJoinAndSelect('machines.company', 'companies')
      .leftJoinAndSelect('machines.machineCategory', 'machine_categories')
      .leftJoinAndSelect('machines.sellingPoint', 'selling_points')
      .where(companyIdsFilter);
    if (active !== undefined) {
      queryMachines.andWhere('machines.active = :active', {
        active,
      });
    }

    if (machineCategoryId)
      queryMachines.andWhere('machines.machine_category_id = :id', {
        id: machineCategoryId,
      });

    if (keywords)
      queryMachines.andWhere(
        new Brackets(qb => {
          qb.andWhere('machines.serial_number like :serialNumber', {
            serialNumber: `%${keywords}%`,
          })
            .orWhere('machines.description like :description', {
              description: `%${keywords}%`,
            })
            .orWhere('selling_points.name like :id', {
              id: `%${keywords}%`,
            });
        }),
      );

    if (limit) queryMachines.take(limit);

    if (page) queryMachines.skip(limit || 0 * page);

    const [machines, machinesCount] = await queryMachines.getManyAndCount();

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
