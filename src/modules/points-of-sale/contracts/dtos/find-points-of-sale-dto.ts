import PointOfSale from '../models/point-of-sale';

interface FindPointsOfSaleDto {
  limit?: number;
  offset?: number;
  filters: Partial<PointOfSale>;
  populate?: string[];
}

export default FindPointsOfSaleDto;
