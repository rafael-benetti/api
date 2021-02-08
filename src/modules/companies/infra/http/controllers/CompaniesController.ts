import CreateCompanyService from '@modules/companies/services/CreateCompanyService';
import ListCompaniesService from '@modules/companies/services/ListCompaniesService';
import UpdateCompaniesService from '@modules/companies/services/UpdateCompanyService';
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
    const listCompaniesService = container.resolve(ListCompaniesService);

    const companies = await listCompaniesService.execute();

    return res.json(companies);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, name } = req.body;
    const { userId } = req;

    const updateCompaniesService = container.resolve(UpdateCompaniesService);

    const company = await updateCompaniesService.execute({ id, name, userId });

    return res.json(company);
  }
}
