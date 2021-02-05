import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // @OneToMany(() => ProductToUser, productToUser => productToUser.productInfo)
  // productToUser: ProductToUser[];
}

export default Product;
