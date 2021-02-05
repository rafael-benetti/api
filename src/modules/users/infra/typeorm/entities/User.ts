import Company from '@modules/companies/infra/typeorm/entities/Company';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'active', default: 1 })
  isActive: number;

  @Column()
  roles: string;

  @Column({ name: 'is_operator' })
  isOperator: number;

  @Column({ nullable: true })
  picture: string;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToMany(() => Company)
  @JoinTable({
    name: 'user_company',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
  })
  companies: Company[];

  // @OneToMany(() => ProductToUser, productToUser => productToUser.owner)
  // products: ProductToUser[];
  //
  // @OneToMany(() => MachineCategory, machineCategory => machineCategory.owner)
  // machineCategories: MachineCategory[];
}

export default User;
