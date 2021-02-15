import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import { getRepository, Repository } from 'typeorm';
import Product from '../entities/Product';

export default class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    ownerId,
    cost,
    price,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      ownerId,
      cost,
      price,
    });

    await this.ormRepository.save(product);
    return product;
  }

  public async findAllProducts(userId: number): Promise<Product[]> {
    const products = await this.ormRepository.find({
      where: { ownerId: userId },
      relations: ['productToUser'],
    });

    return products;
  }

  public async findByName(
    name: string,
    ownerId: number,
  ): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name, ownerId },
    });

    return product;
  }
}
