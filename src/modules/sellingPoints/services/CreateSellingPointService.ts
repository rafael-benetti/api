import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';
import IAddressesRepository from '../repositories/IAddressesRepository';
import ISellingPointsRepository from '../repositories/ISellingPointsRepository';

interface IRequest {
  name: string;
  companyId: number;
  responsible: string;
  phone1: string;
  phone2: string;
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
  ) {}

  public async execute({
    name,
    address,
    companyId,
    phone1,
    phone2,
    responsible,
  }: IRequest): Promise<SellingPoint> {
    const newAddress = this.addressesRepository.create(address);

    if (!newAddress) {
      throw AppError.unknownError;
    }

    const sellingPoint = await this.sellingPointsRepository.create({
      name,
      responsible,
      phone2,
      phone1,
      companyId,
      address: newAddress,
    });

    return sellingPoint;
  }
}

export default CreateSellingPointService;
