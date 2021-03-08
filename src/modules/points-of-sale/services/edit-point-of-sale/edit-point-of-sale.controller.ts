import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditPointOfSaleService from './edit-point-of-sale.service';

abstract class EditPointOfSaleController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { pointOfSaleId } = req.query;
    const {
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      routeId,
      extraInfo,
    } = req.body;

    const editPointOfSaleService = container.resolve(EditPointOfSaleService);

    const pointOfSale = await editPointOfSaleService.execute({
      contactName,
      extraInfo,
      label,
      pointOfSaleId: pointOfSaleId as string,
      primaryPhoneNumber,
      routeId,
      secondaryPhoneNumber,
      userId,
    });

    return res.json(pointOfSale);
  }
}

export default EditPointOfSaleController;
