import { inject, injectable } from 'tsyringe';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(userId: number): Promise<Product[]> {
    const products = await this.productsRepository.findAllProducts(userId);

    return products;
  }
}

export default ListProductsService;
