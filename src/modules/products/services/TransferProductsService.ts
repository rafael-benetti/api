import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import IProductsStocksRepository from '../repositories/IProductsStocksRepository';

interface IRequest {
  userId: number;
  productId: number;
  quantity: number;
  targetUserId: number;
}

@injectable()
class TransferProductsService {
  constructor(
    @inject('IProductsStocksRepository')
    private productsStocksRepository: IProductsStocksRepository,
  ) {}

  public async execute({
    userId,
    productId,
    quantity,
    targetUserId,
  }: IRequest): Promise<void> {
    const userStock = await this.productsStocksRepository.findByRelation({
      userId,
      productId,
    });

    if (!userStock) {
      throw AppError.productNotFound;
    }

    if (quantity > userStock.quantity) {
      throw AppError.insufficientProducts;
    }

    const targetUserStock = await this.productsStocksRepository.findByRelation({
      userId: targetUserId,
      productId,
    });

    if (targetUserStock) {
      await this.productsStocksRepository.update({
        id: targetUserStock.id,
        quantity: targetUserStock.quantity + quantity,
      });
    } else {
      await this.productsStocksRepository.create({
        quantity,
        targetUserId,
        productId,
      });
    }

    await this.productsStocksRepository.update({
      id: userStock.id,
      quantity: userStock.quantity - quantity,
    });
  }
}

export default TransferProductsService;
