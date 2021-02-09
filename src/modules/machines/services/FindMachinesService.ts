import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Machine from '../infra/typeorm/entities/Machine';
import IMachinesRepository from '../repositories/IMachinesRepository';

interface IRequest {
  userId: number;
  companyId?: number;
  isActive?: string;
  name?: string;
  limit: number;
  page: number;
}

@injectable()
class FindMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    companyId,
    isActive,
    name,
    userId,
    limit,
    page,
  }: IRequest): Promise<Machine[]> {
    let companyIds: number[] = [];
    let active: number | undefined;

    if (isActive) {
      if (isActive === 'true') {
        active = 1;
      } else if (isActive === 'false') {
        active = 0;
      } else {
        throw AppError.incorrectFilters;
      }
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.authorizationError;
    }

    companyIds = user.companies.map(company => company.id);

    if (companyId) {
      if (companyIds.includes(companyId)) {
        companyIds = [companyId];
      } else {
        throw AppError.authorizationError;
      }
    }

    const machines = await this.machinesRepository.findMachines({
      companyIds,
      active,
      name,
      limit,
      page,
    });

    const convertedMachines = machines.map(machine => {
      machine.gameValue = Number(machine.gameValue);
      return machine;
    });

    return convertedMachines;
  }
}

export default FindMachinesService;
