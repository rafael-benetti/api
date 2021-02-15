import CreateSellingPointService from '@modules/sellingPoints/services/CreateSellingPointService';
import FindSellingPointsService from '@modules/sellingPoints/services/FindSellingPointsService';
import UpdateSellingPointsService from '@modules/sellingPoints/services/UpdateSellingPointsService';
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
      address: { zipCode, state, city, neighborhood, street, number, note },
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
      address: { zipCode, state, city, neighborhood, street, number, note },
    });

    return res.json(sellingPoint);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { companyId, name } = req.query;

    const findSellingPointsService = container.resolve(
      FindSellingPointsService,
    );

    const sellingPoints = await findSellingPointsService.execute({
      name: name as string,
      companyId: Number(companyId),
      userId,
    });

    return res.json(sellingPoints);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { sellingPointId } = req.query;
    const { address, name, companyId, phone1, phone2, responsible } = req.body;

    const updateSellingPointsService = container.resolve(
      UpdateSellingPointsService,
    );

    const sellingPoint = await updateSellingPointsService.execute({
      id: Number(sellingPointId),
      address,
      companyId,
      name,
      phone1,
      phone2,
      responsible,
    });

    return res.json(sellingPoint);
  }
}

export default SellingPointsController;
