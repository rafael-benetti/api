import ICreateTransferProductsDTO from '@modules/products/dtos/ICreateTransferProductsDTO';
import IFindByRelationDTO from '@modules/products/dtos/IFindByRelationDTO';
import IUpdateTransferProductDTO from '@modules/products/dtos/IUpdateTransferProductDTO';
import ITransferProductsRepository from '@modules/products/repositories/ITransferProductsRepository';
import { getRepository, Repository } from 'typeorm';
import ProductToUser from '../entities/ProductToUser';

class ProductToUserRepository implements ITransferProductsRepository {
  private ormRepository: Repository<ProductToUser>;

  constructor() {
    this.ormRepository = getRepository(ProductToUser);
  }

  public async update({
    id,
    quantity,
  }: IUpdateTransferProductDTO): Promise<void> {
    await this.ormRepository.update(id, { quantity });
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
    targetUserId,
    productId,
    quantity,
  }: ICreateTransferProductsDTO): Promise<ProductToUser> {
    const productToUser = this.ormRepository.create({
      quantity,
      productId,
      userId: targetUserId,
    });

    const response = await this.ormRepository.save(productToUser);

    return response;
  }
}

export default ProductToUserRepository;
