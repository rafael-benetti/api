import CreateCompanyService from '@modules/companies/services/CreateCompanyService';
import UpdateCompaniesService from '@modules/companies/services/UpdateCompanyService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CompaniesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { name } = req.body;

    const createCompanyService = container.resolve(CreateCompanyService);

    const company = await createCompanyService.execute({
      name,
      userId,
    });

    return res.json(company);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { companyId } = req.query;
    const { name } = req.body;
    const { userId } = req;

    const updateCompaniesService = container.resolve(UpdateCompaniesService);

    const company = await updateCompaniesService.execute({
      id: Number(companyId),
      name,
      userId,
    });

    return res.json(company);
  }
}
