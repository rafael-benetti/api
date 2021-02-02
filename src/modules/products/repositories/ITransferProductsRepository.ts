import ICreateTransferProductsDTO from '../dtos/ICreateTransferProductsDTO';
import IFindByRelationDTO from '../dtos/IFindByRelationDTO';
import IUpdateTransferProductDTO from '../dtos/IUpdateTransferProductDTO';
import ProductToUser from '../infra/typeorm/entities/ProductToUser';

export default interface IProductToUserRepository {
  create(data: ICreateTransferProductsDTO): Promise<ProductToUser>;
  findByRelation(data: IFindByRelationDTO): Promise<ProductToUser | undefined>;
  update(data: IUpdateTransferProductDTO): Promise<void>;
}
