import ICreateProductDTO from '../dtos/ICreateProductDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findByName(name: string, ownerId: number): Promise<Product | undefined>;
  findAllProducts(userId: number): Promise<Product[]>;
}
