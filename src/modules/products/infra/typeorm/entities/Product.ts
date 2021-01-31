import User from '@modules/users/infra/typeorm/entities/User';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  cost: number;

  @Column()
  price: number;

  @OneToMany(() => User, user => user.id)
  ownerId: number;
}

export default Product;
