import IMachinesRepository from '@modules/machines/repositories/IMachinesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import MachineCollect from '../infra/typeorm/entities/MachineCollect';
import IMachineCollectionRepository from '../repositories/IMachineCollectionRepository';

interface IRequest {
  userId: number;
  keywords: string;
}

@injectable()
class FindMachineCollectionService {
  constructor(
    @inject('MachineCollectionRepository')
    private machineCollectionRepository: IMachineCollectionRepository,

    @inject('MachinesRepository')
    private machineRepository: IMachinesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    keywords,
  }: IRequest): Promise<MachineCollect[]> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.userNotFound;
    }

    const companyIds = user.companies.map(company => company.id);

    const { machines } = await this.machineRepository.findMachines({
      companyIds,
    });

    const machineIds = machines.map(machine => machine.id);

    const machineCollection = await this.machineCollectionRepository.findMachineCollection(
      {
        machineIds,
        keywords,
      },
    );

    return machineCollection;
  }
}

export default FindMachineCollectionService;
