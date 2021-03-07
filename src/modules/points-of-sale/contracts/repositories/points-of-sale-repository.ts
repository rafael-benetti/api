import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreatePointOfSaleDto from '../dtos/create-point-of-sale-dto';
import PointOfSale from '../models/point-of-sale';

export default interface PointsOfSaleRepository {
  create(data: CreatePointOfSaleDto): PointOfSale;
  find(data: FindEntityDto<PointOfSale>): Promise<PointOfSale[]>;
  findOne(data: FindEntityDto<PointOfSale>): Promise<PointOfSale | undefined>;
  save(data: PointOfSale): void;
}
