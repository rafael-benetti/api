import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IFindByNameDTO from '@modules/products/dtos/IFindByNameDTO';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import { getRepository, Repository } from 'typeorm';
import Product from '../entities/Product';

export default class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
  }

  public async create({
    name,
    cost,
    price,
    ownerId,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      cost,
      price,
      ownerId,
    });

    await this.ormRepository.save(product);
    return product;
  }

  public async findAllProducts(userId: number): Promise<Product[]> {
    const products = await this.ormRepository.find({
      where: { ownerId: userId },
      relations: ['productStock'],
    });

    return products;
  }

  public async findByName({
    name,
    ownerId,
  }: IFindByNameDTO): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name, ownerId },
    });

    return product;
  }

  public async findById(productId: number): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { id: productId },
    });

    return product;
  }
}
