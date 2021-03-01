import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePointOfSaleService from './create-point-of-sale-service';

class CreatePointOfSaleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      address,
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
    });

    return res.json(pointOfSale);
  }
}

export default CreatePointOfSaleController;
