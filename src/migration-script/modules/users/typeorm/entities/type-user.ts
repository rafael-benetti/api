/* eslint-disable import/no-extraneous-dependencies */
import TypeCompany from 'migration-script/modules/companies/typeorm/entities/type-company';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
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

  @ManyToMany(() => TypeCompany, company => company.users, {
    cascade: ['insert', 'update'],
  })
  companies: TypeCompany[];
}

export default User;
