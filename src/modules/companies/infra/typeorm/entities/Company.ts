import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UsersCompanies from './UsersCompanies';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @OneToOne(() => UsersCompanies, usersCompanies => usersCompanies.company)
  @JoinColumn({ name: 'id' })
  usersCompanies: UsersCompanies;
}

export default Company;
