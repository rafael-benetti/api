import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import Company from './Company';

@Entity('user_company')
class UsersCompanies {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'company_id' })
  companyId: number;

  @OneToOne(() => Company, company => company.usersCompanies)
  company: Company;
}

export default UsersCompanies;
