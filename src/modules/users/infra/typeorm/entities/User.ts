import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

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
}

export default User;
