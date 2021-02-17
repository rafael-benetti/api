import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';
import IProductsStocksRepository from '../repositories/IProductsStocksRepository';

interface IRequest {
  name: string;
  cost: number;
  price: number;
  ownerId: number;
  quantity: number;
}

interface IResponse {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productRepository: IProductsRepository,

    @inject('IProductsStocksRepository')
    private productsStocksRepository: IProductsStocksRepository,
  ) {}

  public async execute({
    name,
    price,
    cost,
    ownerId,
    quantity,
  }: IRequest): Promise<IResponse> {
    const checkNameExists = await this.productRepository.findByName(
      name,
      ownerId,
    );
    // TODO: Rever logica de criação de estoque
    // TODO: Implementar transaction
    if (checkNameExists) {
      throw AppError.nameAlreadyInUsed;
    }

    const product = await this.productRepository.create({
      cost,
      name,
      ownerId,
      price,
    });

    const productToUser = await this.productsStocksRepository.create({
      targetUserId: ownerId,
      quantity,
      productId: product.id,
    });

    const response: IResponse = {
      id: product.id,
      name: product.name,
      cost: product.cost,
      quantity: productToUser.quantity,
    };

    return response;
  }
}

export default CreateProductService;
