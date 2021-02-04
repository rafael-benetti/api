import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';
import IFindCompaniesDTO from '../dtos/IFindCompaniesDTO';
import Company from '../infra/typeorm/entities/Company';

export default interface ICompaniesRepository {
  create(data: ICreateCompanyDTO): Promise<Company>;
  findByName(name: string, ownerId: number): Promise<Company | undefined>;
  findCompanies(ownerId: IFindCompaniesDTO): Promise<Company[]>;
}
