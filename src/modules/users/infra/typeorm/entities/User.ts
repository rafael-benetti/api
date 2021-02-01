import Company from '@modules/companies/infra/typeorm/entities/Company';
import Product from '@modules/products/infra/typeorm/entities/Product';
import {
  Column,
  Entity,
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

  @OneToMany(() => Company, company => company.owner)
  companies: Company[];

  @ManyToMany(() => Product, product => product.users)
  products: Product[];
}

export default User;
