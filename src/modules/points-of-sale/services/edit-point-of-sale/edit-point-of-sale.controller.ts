import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import EditPointOfSaleService from './edit-point-of-sale.service';

abstract class EditPointOfSaleController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { pointOfSaleId } = req.params;
    const {
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      rent,
      isPercentage,
      address,
    } = req.body;

    const editPointOfSale = container.resolve(EditPointOfSaleService);

    const pointOfSale = await editPointOfSale.execute({
      userId,
      pointOfSaleId,
      label,
      contactName,
      primaryPhoneNumber,
      secondaryPhoneNumber,
      rent,
      isPercentage,
      address,
    });

    return res.json(pointOfSale);
  };
}

export default EditPointOfSaleController;
