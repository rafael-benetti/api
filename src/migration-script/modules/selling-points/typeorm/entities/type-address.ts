/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import TypeSellingPoint from './type-selling-point';

@Entity('address')
class TypeAddress {
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

  @OneToOne(() => TypeSellingPoint, {
    cascade: ['insert', 'update', 'remove'],
  })
  sellingPoint: TypeSellingPoint;
}

export default TypeAddress;
