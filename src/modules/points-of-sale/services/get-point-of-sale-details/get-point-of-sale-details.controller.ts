import { container } from 'tsyringe';
import { Response, Request } from 'express';
import GetPointOfSaleDetailsService from './get-point-of-sale-details.service';

abstract class GetPointOfSaleDetailsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { pointOfSaleId } = req.params;

    const getPointOfSaleDetailsService = container.resolve(
      GetPointOfSaleDetailsService,
    );

    const response = await getPointOfSaleDetailsService.execute({
      pointOfSaleId,
      userId,
    });

    return res.json(response);
  }
}

export default GetPointOfSaleDetailsController;
