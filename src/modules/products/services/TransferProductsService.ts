import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import IProductStocksRepository from '../repositories/IProductStocksRepository';

interface IRequest {
  userId: number;
  productId: number;
  quantity: number;
  targetUserId: number;
}

@injectable()
class TransferProductsService {
  constructor(
    @inject('ProductStocksRepository')
    private productStocksRepository: IProductStocksRepository,
  ) {}

  public async execute({
    userId,
    productId,
    quantity,
    targetUserId,
  }: IRequest): Promise<void> {
    const userStock = await this.productStocksRepository.findByRelation({
      userId,
      productId,
    });

    if (!userStock) throw AppError.productNotFound;

    if (quantity > userStock.quantity) throw AppError.insufficientProducts;

    const targetUserStock = await this.productStocksRepository.findByRelation({
      userId: targetUserId,
      productId,
    });

    if (targetUserStock) {
      await this.productStocksRepository.update({
        id: targetUserStock.id,
        quantity: targetUserStock.quantity + quantity,
      });
    } else {
      await this.productStocksRepository.create({
        quantity,
        targetUserId,
        productId,
      });
    }

    await this.productStocksRepository.update({
      id: userStock.id,
      quantity: userStock.quantity - quantity,
    });
  }
}

export default TransferProductsService;
