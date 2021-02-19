import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IFindByNameDTO from '../dtos/IFindByNameDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findByName(data: IFindByNameDTO): Promise<Product | undefined>;
  findAllProducts(userId: number): Promise<Product[]>;
  findById(productId: number): Promise<Product | undefined>;
  save(product: Product): Promise<Product>;
}
