import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import IProductsRepository from '../repositories/IProductsRepository';
import IProductStocksRepository from '../repositories/IProductStocksRepository';

interface IRequest {
  name: string;
  cost: number;
  price: number;
  userId: number;
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
    private productsRepository: IProductsRepository,

    @inject('ProductStocksRepository')
    private productStocksRepository: IProductStocksRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    price,
    cost,
    userId,
    quantity,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    const checkNameExists = await this.productsRepository.findByName({
      name,
      ownerId: user.ownerId,
    });

    // TODO: Rever logica de criação de estoque
    // TODO: Implementar transaction
    if (checkNameExists) throw AppError.nameAlreadyInUsed;

    const product = await this.productsRepository.create({
      name,
      cost,
      price,
      ownerId: user.ownerId,
    });

    const productStock = await this.productStocksRepository.create({
      targetUserId: userId,
      quantity,
      productId: product.id,
    });

    const response: IResponse = {
      id: product.id,
      name: product.name,
      cost: product.cost,
      quantity: productStock.quantity,
    };

    return response;
  }
}

export default CreateProductService;
