import User from '@modules/users/infra/typeorm/entities/User';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 6, scale: 2 })
  cost: number;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToMany(() => User, user => user.products)
  users: User[];
}

export default Product;
