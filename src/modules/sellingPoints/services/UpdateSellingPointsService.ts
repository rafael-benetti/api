import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';
import ISellingPointsRepository from '../repositories/ISellingPointsRepository';

interface IRequest {
  id: number;
  name: string;
  responsible: string;
  phone2: string;
  phone1: string;
  companyId: number;
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
class UpdateSellingPointsService {
  constructor(
    @inject('SellingPointsRepository')
    private sellingPointsRepository: ISellingPointsRepository,
  ) {}

  public async execute({
    id,
    address,
    name,
    companyId,
    phone1,
    phone2,
    responsible,
  }: IRequest): Promise<SellingPoint> {
    // TODO: VALIDAR SE O SELLING POINT ESTA RELACIONADO A ALGUMA COMPANY DO USER
    const sellingPoint = await this.sellingPointsRepository.findById(id);

    if (!sellingPoint) throw AppError.sellingPointNotFound;

    if (name) sellingPoint.name = name;
    if (phone1) sellingPoint.phone1 = phone1;
    if (phone2) sellingPoint.phone2 = phone2;
    if (responsible) sellingPoint.responsible = responsible;
    if (companyId) sellingPoint.companyId = companyId;
    if (address) {
      if (address.city) sellingPoint.address.city = address.city;
      if (address.neighborhood)
        sellingPoint.address.neighborhood = address.neighborhood;
      if (address.note) sellingPoint.address.note = address.note;
      if (address.number) sellingPoint.address.number = address.number;
      if (address.state) sellingPoint.address.state = address.state;
      if (address.street) sellingPoint.address.street = address.street;
      if (address.zipCode) sellingPoint.address.zipCode = address.zipCode;
    }

    await this.sellingPointsRepository.save(sellingPoint);

    return sellingPoint;
  }
}

export default UpdateSellingPointsService;
