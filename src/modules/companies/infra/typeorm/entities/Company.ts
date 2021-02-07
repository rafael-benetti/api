import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import UsersCompanies from './UsersCompanies';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @OneToMany(() => UsersCompanies, usersCompanies => usersCompanies.company)
  userToCompanies: UsersCompanies[];
}

export default Company;
