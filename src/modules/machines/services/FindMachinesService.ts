import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Machine from '../infra/typeorm/entities/Machine';
import IMachinesRepository from '../repositories/IMachinesRepository';

interface IRequest {
  userId: number;
  companyId?: number;
  machineCategoryId?: number;
  isActive?: string;
  keywords?: string;
  limit: number;
  page: number;
}

interface IResponse {
  machines: Machine[];
  machinesCount: number;
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
    machineCategoryId,
    isActive,
    keywords,
    userId,
    limit,
    page,
  }: IRequest): Promise<IResponse> {
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

    const {
      machines,
      machinesCount,
    } = await this.machinesRepository.findMachines({
      companyIds,
      machineCategoryId,
      active,
      keywords,
      limit,
      page,
    });

    return { machines, machinesCount };
  }
}

export default FindMachinesService;
