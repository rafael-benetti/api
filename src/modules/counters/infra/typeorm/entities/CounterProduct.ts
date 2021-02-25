import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('counters_products')
class CounterProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number;

  @Column()
  slot: number;

  @Column({ name: 'counter_id' })
  counterId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'machine_id' })
  machineId: number;
}

export default CounterProduct;
