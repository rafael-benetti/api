import ICreateProductToUserDTO from '../dtos/ICreateProductToUserDTO';
import IFindByRelationDTO from '../dtos/IFindByRelationDTO';
import ProductToUser from '../infra/typeorm/entities/ProductToUser';

export default interface IProductToUserRepository {
  create(data: ICreateProductToUserDTO): Promise<ProductToUser>;
  findByRelation(data: IFindByRelationDTO): Promise<ProductToUser | undefined>;
}
