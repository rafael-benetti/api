import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import SellingPoint from './SellingPoint';

@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column()
  street: string;

  @Column()
  number: number;

  @Column()
  note: string;

  @OneToOne(() => SellingPoint, {
    cascade: ['insert', 'update', 'remove'],
  })
  sellingPoint: SellingPoint;
}

export default Address;
