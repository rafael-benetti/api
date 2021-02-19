import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';
import IFindCompaniesDTO from '../dtos/IFindCompaniesDTO';
import IFindCompanyByNameDTO from '../dtos/IFindCompanyByNameDTO';
import Company from '../infra/typeorm/entities/Company';

export default interface ICompaniesRepository {
  create(data: ICreateCompanyDTO): Promise<Company>;
  findByName(data: IFindCompanyByNameDTO): Promise<Company | undefined>;
  findCompaniesByUserId(ownerId: IFindCompaniesDTO): Promise<Company[]>;
  findCompanies(companyIds: number[]): Promise<Company[]>;
  findCompaniesWithUsers(companyIds: number[]): Promise<Company[]>;
  findById(companyId: number): Promise<Company | undefined>;
  save(company: Company): Promise<void>;
}
