import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_products')
class ProductToUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'user_id' })
  userId: number;

  // @ManyToOne(() => User, user => user.products)
  // @JoinColumn({ name: 'user_id' })
  // owner: User;

  // @ManyToOne(() => Product, product => product.productToUser, { eager: true })
  // @JoinColumn({ name: 'product_id' })
  // productInfo: Product;
}

export default ProductToUser;
