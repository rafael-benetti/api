import ICreateTransferProductsDTO from '../dtos/ICreateTransferProductsDTO';
import IFindByRelationDTO from '../dtos/IFindByRelationDTO';
import IUpdateTransferProductDTO from '../dtos/IUpdateTransferProductDTO';
import ProductStock from '../infra/typeorm/entities/ProductStock';

export default interface IProductStocksRepository {
  create(data: ICreateTransferProductsDTO): Promise<ProductStock>;
  findByRelation(data: IFindByRelationDTO): Promise<ProductStock | undefined>;
  update(data: IUpdateTransferProductDTO): Promise<void>;
  save(productStock: ProductStock): Promise<ProductStock>;
}
