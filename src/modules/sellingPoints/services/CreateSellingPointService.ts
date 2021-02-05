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
  addressData: {
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
    addressData,
    companyId,
    phone1,
    phone2,
    responsible,
  }: IRequest): Promise<SellingPoint> {
    const address = await this.addressesRepository.create(addressData);

    if (!address) {
      throw AppError.unknownError;
    }

    const addressId = address.id;

    const sellingPoint = await this.sellingPointsRepository.create({
      name,
      responsible,
      phone2,
      phone1,
      companyId,
      addressId,
    });

    return sellingPoint;
  }
}

export default CreateSellingPointService;
