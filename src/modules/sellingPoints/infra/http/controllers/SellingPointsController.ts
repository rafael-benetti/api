import CreateSellingPointService from '@modules/sellingPoints/services/CreateSellingPointService';
import FindSellingPointsService from '@modules/sellingPoints/services/FindSellingPointsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SellingPointsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      companyId,
      responsible,
      phone1,
      phone2,
      addressData: { zipCode, state, city, neighborhood, street, number, note },
    } = req.body;

    const createSellingPointService = container.resolve(
      CreateSellingPointService,
    );

    const sellingPoint = await createSellingPointService.execute({
      name,
      companyId,
      responsible,
      phone1,
      phone2,
      addressData: { zipCode, state, city, neighborhood, street, number, note },
    });

    return res.json(sellingPoint);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { companyId, name } = req.query;

    const findSellingPointsService = container.resolve(
      FindSellingPointsService,
    );

    const sellingPoints = await findSellingPointsService.execute({
      name: name as string,
      companyId: Number(companyId),
    });

    return res.json(sellingPoints);
  }
}

export default SellingPointsController;
