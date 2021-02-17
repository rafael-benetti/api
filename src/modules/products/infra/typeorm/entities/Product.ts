import TypeormNumberTransformer from '@shared/utils/TypeormNumberTransformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ProductStock from './ProductStock';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    transformer: new TypeormNumberTransformer(),
  })
  cost: number;

  @Column('decimal', {
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @OneToMany(() => ProductStock, productStock => productStock.productInfo)
  productStock: ProductStock[];
}

export default Product;
