import Address from '@modules/points-of-sale/contracts/models/address';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale-repository';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  label: string;
  contactName: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  address: Address;
}

@injectable()
class CreatePointOfSaleService {
  constructor(
    @inject('MikroPointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,
  ) {}

  async execute({
    label,
    contactName,
    primaryPhoneNumber,
    secondaryPhoneNumber,
    address,
  }: Request): Promise<PointOfSale> {
    const pointOfSale = this.pointsOfSaleRepository.create({
      address,
      contactName,
      label,
      ownerId: 'chama', // TODO
      primaryPhoneNumber,
      secondaryPhoneNumber,
    });

    await this.pointsOfSaleRepository.save();

    return pointOfSale;
  }
}

export default CreatePointOfSaleService;
