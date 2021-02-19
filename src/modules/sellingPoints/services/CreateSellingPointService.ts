import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';
import IAddressesRepository from '../repositories/IAddressesRepository';
import ISellingPointsRepository from '../repositories/ISellingPointsRepository';

interface IRequest {
  userId: number;
  name: string;
  companyId: number;
  responsible: string;
  phone1: string;
  phone2?: string;
  address: {
    zipCode: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: number;
    note: string;
  };
}

@injectable()
class CreateSellingPointService {
  constructor(
    @inject('SellingPointsRepository')
    private sellingPointsRepository: ISellingPointsRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    address,
    companyId,
    phone1,
    phone2,
    responsible,
    userId,
  }: IRequest): Promise<SellingPoint> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const userCompanyIds = user.companies.map(company => company.id);

    if (!userCompanyIds.includes(companyId)) throw AppError.authorizationError;

    const checkNameExists = await this.sellingPointsRepository.findByName({
      name,
      companyIds: userCompanyIds,
    });

    if (checkNameExists) throw AppError.nameAlreadyInUsed;

    const newAddress = this.addressesRepository.create(address);

    const sellingPoint = await this.sellingPointsRepository.create({
      name,
      responsible,
      phone1,
      phone2: phone2 || undefined,
      companyId,
      address: newAddress,
    });

    return sellingPoint;
  }
}

export default CreateSellingPointService;
