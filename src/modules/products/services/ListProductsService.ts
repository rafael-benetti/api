import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';

interface IResponse {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(userId: number): Promise<IResponse[]> {
    const products = await this.productsRepository.findAllProducts(userId);

    const formatedProducts = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        cost: product.cost,
        quantity: product.productStock[0].quantity,
      };
    });

    return formatedProducts;
  }
}

export default ListProductsService;
