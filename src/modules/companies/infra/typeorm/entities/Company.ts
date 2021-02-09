import Machine from '@modules/machines/infra/typeorm/entities/Machine';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @ManyToMany(() => User, user => user.companies, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable({
    name: 'user_company',
    joinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToMany(() => Machine, machine => machine.company)
  machines: Machine[];
}

export default Company;
