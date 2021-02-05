import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import IUsersCompaniesRepository from '../repositories/IUsersCompaniesRepository';

interface IRequest {
  userId: number;
}

@injectable()
class ListCompaniesService {
  constructor(
    @inject('UsersCompaniesRepository')
    private usersCompaniesRepository: IUsersCompaniesRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<Company[]> {
    const usersCompanies = await this.usersCompaniesRepository.findCompanies(
      userId,
    );

    const companies = usersCompanies.map(userCompany => {
      return userCompany.company;
    });

    return companies;
  }
}

export default ListCompaniesService;
