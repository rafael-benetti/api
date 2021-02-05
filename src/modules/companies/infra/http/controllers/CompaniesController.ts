import CreateCompanyService from '@modules/companies/services/CreateCompanyService';
import ListCompaniesService from '@modules/companies/services/ListCompaniesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CompaniesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const ownerId = Number(req.userId);
    const { name } = req.body;

    const createCompanyService = container.resolve(CreateCompanyService);

    const company = await createCompanyService.execute({
      name,
      ownerId,
    });

    return res.json(company);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listCompaniesService = container.resolve(ListCompaniesService);

    const companies = await listCompaniesService.execute({
      userId: Number(userId),
    });

    return res.json(companies);
  }
}
