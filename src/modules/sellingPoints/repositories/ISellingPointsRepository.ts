import ICreateSellingPointDTO from '../dtos/ICreateSellingPointDTO';
import IFindByNameDTO from '../dtos/IFindByNameDTO';
import IFindSellingPointsDTO from '../dtos/IFindSellingPointsDTO';
import SellingPoint from '../infra/typeorm/entities/SellingPoint';

export default interface ISellingPointsRepository {
  create(data: ICreateSellingPointDTO): Promise<SellingPoint>;
  find(data: IFindSellingPointsDTO): Promise<SellingPoint[]>;
  findById(sellingPointId: number): Promise<SellingPoint | undefined>;
  findByName(data: IFindByNameDTO): Promise<SellingPoint | undefined>;
  save(sellingPoint: SellingPoint): Promise<void>;
}
