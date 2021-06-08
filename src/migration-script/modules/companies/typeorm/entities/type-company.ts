/* eslint-disable import/no-extraneous-dependencies */
import TypeUser from 'migration-script/modules/users/typeorm/entities/type-user';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('company')
class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToMany(() => TypeUser, user => user.companies, {
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
  users: TypeUser[];
}

export default Company;
