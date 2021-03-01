import CreatePointOfSaleDto from '../dtos/create-point-of-sale-dto';
import PointOfSale from '../models/point-of-sale';

export default interface PointsOfSaleRepository {
  create(data: CreatePointOfSaleDto): PointOfSale;
  save(): Promise<void>;
}
