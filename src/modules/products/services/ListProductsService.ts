import { inject, injectable } from 'tsyringe';
import IProductStocksRepository from '../repositories/IProductStocksRepository';

interface IResponse {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductStocksRepository')
    private productStocksRepository: IProductStocksRepository,
  ) {}

  public async execute(userId: number): Promise<IResponse[]> {
    const productStocks = await this.productStocksRepository.find(userId);

    const formatedProducts = productStocks.map(productStock => {
      return {
        id: productStock.productInfo.id,
        quantity: productStock.quantity,
        name: productStock.productInfo.name,
        cost: productStock.productInfo.cost,
      };
    });

    return formatedProducts;
  }
}

export default ListProductsService;
