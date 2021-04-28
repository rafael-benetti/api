import { container } from 'tsyringe';
import { Response, Request } from 'express';
import Period from '@modules/machines/contracts/dtos/period.dto';
import GetPointOfSaleDetailsService from './get-point-of-sale-details.service';

abstract class GetPointOfSaleDetailsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { pointOfSaleId } = req.params;
    const { period } = req.query;

    const getPointOfSaleDetailsService = container.resolve(
      GetPointOfSaleDetailsService,
    );

    const response = await getPointOfSaleDetailsService.execute({
      pointOfSaleId,
      userId,
      period: period as Period,
    });

    return res.json(response);
  }
}

export default GetPointOfSaleDetailsController;
