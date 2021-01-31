import User from '@modules/users/infra/typeorm/entities/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, user => user.companies)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}

export default Company;
