import ICreateTransferProductsDTO from '@modules/products/dtos/ICreateTransferProductsDTO';
import IFindByRelationDTO from '@modules/products/dtos/IFindByRelationDTO';
import IUpdateTransferProductDTO from '@modules/products/dtos/IUpdateTransferProductDTO';
import IProductStocksRepository from '@modules/products/repositories/IProductsStocksRepository';
import { getRepository, Repository } from 'typeorm';
import ProductStock from '../entities/ProductStock';

class ProductStocksRepository implements IProductStocksRepository {
  private ormRepository: Repository<ProductStock>;

  constructor() {
    this.ormRepository = getRepository(ProductStock);
  }

  public async save(productStock: ProductStock): Promise<ProductStock> {
    await this.ormRepository.save(productStock);

    return productStock;
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
  }: IFindByRelationDTO): Promise<ProductStock | undefined> {
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
  }: ICreateTransferProductsDTO): Promise<ProductStock> {
    const productToUser = this.ormRepository.create({
      quantity,
      productId,
      userId: targetUserId,
    });

    const response = await this.ormRepository.save(productToUser);

    return response;
  }
}

export default ProductStocksRepository;
