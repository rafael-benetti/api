import CreatePointOfSaleDto from '../dtos/create-point-of-sale-dto';
import FindByLabelAndGroupIdDto from '../dtos/find-by-lable-and-group-id-dto';
import PointOfSale from '../models/point-of-sale';

export default interface PointsOfSaleRepository {
  create(data: CreatePointOfSaleDto): PointOfSale;
  findByGroupIds(groupIds: string[]): Promise<PointOfSale[]>;
  findByOwnerId(ownerId: string): Promise<PointOfSale[]>;
  findByLabelAndGroupId(
    data: FindByLabelAndGroupIdDto,
  ): Promise<PointOfSale | undefined>;
}
