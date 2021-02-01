import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';
import Company from '../infra/typeorm/entities/Company';

export default interface ICompaniesRepository {
  create(data: ICreateCompanyDTO): Promise<Company>;
  findByName(name: string, ownerId: number): Promise<Company | undefined>;
  findAllCompanies(ownerId: number): Promise<Company[]>;
}
