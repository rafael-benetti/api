import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ProductToUser from './ProductToUser';

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

  @OneToMany(() => ProductToUser, productToUser => productToUser.productInfo)
  productToUser: ProductToUser[];
}

export default Product;
