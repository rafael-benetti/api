import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  cost: number;
  price: number;
  ownerId: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productRepository: IProductsRepository,
  ) {}

  public async execute({
    name,
    price,
    cost,
    ownerId,
  }: IRequest): Promise<Product> {
    const checkNameExists = this.productRepository.findByName(name, ownerId);

    if (checkNameExists) {
      throw AppError.nameAlreadyInUsed;
    }

    const product = await this.productRepository.create({
      cost,
      name,
      ownerId,
      price,
    });

    return product;
  }
}

export default CreateProductService;
