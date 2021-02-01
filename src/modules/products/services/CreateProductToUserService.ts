import { inject, injectable } from 'tsyringe';
import ProductToUser from '../infra/typeorm/entities/ProductToUser';
import IProductToUserRepository from '../repositories/IProductToUserRepository';

interface IRequest {
  userId: number;
  productId: number;
  quantity: number;
}

@injectable()
class ProductToUserService {
  constructor(
    @inject('ProductToUserRepository')
    private productToUserRepository: IProductToUserRepository,
  ) {}

  public async execute({
    userId,
    productId,
    quantity,
  }: IRequest): Promise<ProductToUser> {
    const productToUser = await this.productToUserRepository.findByRelation({
      productId,
      userId,
    });

    if (productToUser) {
      const newProductToUser = await this.productToUserRepository.create({
        id: productToUser.id,
        quantity: quantity + productToUser.quantity,
        productId: productToUser.productId,
        userId: productToUser.userId,
      });

      return newProductToUser;
    }

    const newProductToUser = await this.productToUserRepository.create({
      quantity,
      productId,
      userId,
    });

    return newProductToUser;
  }
}

export default ProductToUserService;
