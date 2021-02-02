import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Product from '../infra/typeorm/entities/Product';
import ProductToUser from '../infra/typeorm/entities/ProductToUser';
import IProductsRepository from '../repositories/IProductsRepository';
import ITransferProductsRepository from '../repositories/ITransferProductsRepository';

interface IRequest {
  name: string;
  cost: number;
  price: number;
  ownerId: number;
  quantity: number;
}

interface IResponse {
  product: Product;
  productToUser: ProductToUser;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productRepository: IProductsRepository,

    @inject('TransferProductsRepository')
    private tranferProductRepository: ITransferProductsRepository,
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

    const productToUser = await this.tranferProductRepository.create({
      targetUserId: ownerId,
      quantity,
      productId: product.id,
    });

    return { productToUser, product };
  }
}

export default CreateProductService;
