import CreatePointOfSaleDto from '../dtos/create-point-of-sale-dto';
import FindPointsOfSaleDto from '../dtos/find-points-of-sale-dto';
import PointOfSale from '../models/point-of-sale';

export default interface PointsOfSaleRepository {
  create(data: CreatePointOfSaleDto): PointOfSale;
  find(data: FindPointsOfSaleDto): Promise<PointOfSale[]>;
  findOne(data: FindPointsOfSaleDto): Promise<PointOfSale | undefined>;
  save(data: PointOfSale): void;
}
