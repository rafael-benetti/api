import Company from '@modules/companies/infra/typeorm/entities/Company';
import UsersCompanies from '@modules/companies/infra/typeorm/entities/UsersCompanies';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @OneToMany(() => UsersCompanies, usersCompanies => usersCompanies.user)
  userToCompanies: UsersCompanies[];

  @ManyToMany(() => Company, company => company.id)
  @JoinTable({
    name: 'companies',
    joinColumn: {
      name: 'id',
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
