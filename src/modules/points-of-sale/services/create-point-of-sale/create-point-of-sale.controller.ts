import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreatePointOfSaleService from './create-point-of-sale.service';

abstract class CreatePointOfSaleController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const {
      groupId,
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      rent,
      isPercentage,
      address,
    } = req.body;

    const createPointOfSale = container.resolve(CreatePointOfSaleService);

    const pointOfSale = await createPointOfSale.execute({
      userId,
      groupId,
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      rent,
      isPercentage,
      address,
    });

    return res.status(201).json(pointOfSale);
  };
}

export default CreatePointOfSaleController;
