import ICreateUsersCompaniesDTO from '../dtos/ICreateUsersCompaniesDTO';
import UsersCompanies from '../infra/typeorm/entities/UsersCompanies';

export default interface IUsersCompaniesRepository {
  create(data: ICreateUsersCompaniesDTO): Promise<UsersCompanies>;
  findCompanies(userId: number): Promise<UsersCompanies[]>;
}
