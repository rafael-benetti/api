import logger from '@config/logger';
import ICreateProductToUserDTO from '@modules/products/dtos/ICreateProductToUserDTO';
import IFindByRelationDTO from '@modules/products/dtos/IFindByRelationDTO';
import IProductToUserRepository from '@modules/products/repositories/IProductToUserRepository';
import { getRepository, Repository } from 'typeorm';
import ProductToUser from '../entities/ProductToUser';

class ProductToUserRepository implements IProductToUserRepository {
  private ormRepository: Repository<ProductToUser>;

  constructor() {
    this.ormRepository = getRepository(ProductToUser);
  }

  public async findByRelation({
    userId,
    productId,
  }: IFindByRelationDTO): Promise<ProductToUser | undefined> {
    const productToUser = await this.ormRepository.findOne({
      where: {
        userId,
        productId,
      },
    });

    return productToUser;
  }

  public async create({
    productId,
    quantity,
    userId,
    id,
  }: ICreateProductToUserDTO): Promise<ProductToUser> {
    const productToUser = this.ormRepository.create({
      id,
      quantity,
      productId,
      userId,
    });

    const response = await this.ormRepository.save(productToUser);

    return response;
  }
}

export default ProductToUserRepository;
