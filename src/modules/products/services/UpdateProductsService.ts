import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';
import IProductStocksRepository from '../repositories/IProductsStocksRepository';

interface IRequest {
  id: number;
  userId: number;
  name: string;
  cost: number;
  quantity: number;
}

interface IResponse {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

@injectable()
class UpdateProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('ProductStocksRepository')
    private productStocksRepository: IProductStocksRepository,
  ) {}

  public async execute({
    id,
    name,
    cost,
    quantity,
    userId,
  }: IRequest): Promise<IResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product) throw AppError.productNotFound;

    const productStock = await this.productStocksRepository.findByRelation({
      userId,
      productId: product.id,
    });

    if (!productStock) {
      throw AppError.productNotFound;
    }

    if (name) product.name = name;
    if (cost) product.cost = cost;
    if (quantity) {
      productStock.quantity = quantity;

      await this.productStocksRepository.save(productStock);
    }

    await this.productsRepository.save(product);

    const response: IResponse = {
      id: product.id,
      name: product.name,
      cost: product.cost,
      quantity: productStock.quantity,
    };

    return response;
  }
}

export default UpdateProductsService;
