import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import ITransferProductsRepository from '../repositories/ITransferProductsRepository';

interface IRequest {
  userId: number;
  productId: number;
  quantity: number;
  targetUserId: number;
}

@injectable()
class TransferProductsService {
  constructor(
    @inject('TransferProductsRepository')
    private transferProductsRepository: ITransferProductsRepository,
  ) {}

  public async execute({
    userId,
    productId,
    quantity,
    targetUserId,
  }: IRequest): Promise<void> {
    const userStock = await this.transferProductsRepository.findByRelation({
      userId,
      productId,
    });

    if (!userStock) {
      throw AppError.productNotFound;
    }

    if (quantity > userStock.quantity) {
      throw AppError.insufficientProducts;
    }

    const targetUserStock = await this.transferProductsRepository.findByRelation(
      {
        userId: targetUserId,
        productId,
      },
    );

    if (targetUserStock) {
      await this.transferProductsRepository.update({
        id: targetUserStock.id,
        quantity: targetUserStock.quantity + quantity,
      });
    } else {
      await this.transferProductsRepository.create({
        quantity,
        targetUserId,
        productId,
      });
    }

    await this.transferProductsRepository.update({
      id: userStock.id,
      quantity: userStock.quantity - quantity,
    });
  }
}

export default TransferProductsService;
