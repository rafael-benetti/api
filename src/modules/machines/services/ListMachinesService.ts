import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
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
class ListMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,

    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
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

    if (!companyId) {
      const companies = await this.companiesRepository.findCompanies({
        ownerId: userId,
      });
      companyIds = companies.map(company => company.id);
    } else {
      companyIds.push(companyId);
    }

    const machines = await this.machinesRepository.listMachines({
      companyIds,
      active,
      name,
      limit,
      page,
    });

    return machines;
  }
}

export default ListMachinesService;
