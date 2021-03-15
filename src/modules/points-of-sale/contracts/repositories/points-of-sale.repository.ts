import CreatePointOfSaleDto from '../dtos/create-point-of-sale.dto';
import FindPointOfSaleDto from '../dtos/find-point-of-sale.dto';
import PointOfSale from '../models/point-of-sale';

interface PointsOfSaleRepository {
  create(data: CreatePointOfSaleDto): PointOfSale;
  findOne(data: FindPointOfSaleDto): Promise<PointOfSale | undefined>;
  find(data: FindPointOfSaleDto): Promise<PointOfSale[]>;
  findByGroupIds(data: string[]): Promise<PointOfSale[]>;
  save(data: PointOfSale): void;
  delete(data: PointOfSale): void;
}

export default PointsOfSaleRepository;
