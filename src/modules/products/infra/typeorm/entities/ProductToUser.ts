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
}

export default ProductToUser;
