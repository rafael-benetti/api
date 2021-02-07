import User from '@modules/users/infra/typeorm/entities/User';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Company from './Company';

@Entity('user_company')
class UsersCompanies {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'company_id' })
  companyId: number;

  @ManyToOne(() => Company, company => company.userToCompanies)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, user => user.userToCompanies)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export default UsersCompanies;
