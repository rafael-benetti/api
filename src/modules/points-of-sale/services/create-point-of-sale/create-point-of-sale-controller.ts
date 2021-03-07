import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePointOfSaleService from './create-point-of-sale-service';

abstract class CreatePointOfSaleController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      address,
      groupId,
      routeId,
    } = req.body;

    const createPointOfSaleService = container.resolve(
      CreatePointOfSaleService,
    );

    const pointOfSale = await createPointOfSaleService.execute({
      userId,
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      address,
      groupId,
      routeId,
    });

    return res.json(pointOfSale);
  }
}

export default CreatePointOfSaleController;
