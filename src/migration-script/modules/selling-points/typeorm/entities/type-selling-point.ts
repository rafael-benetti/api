/* eslint-disable import/no-extraneous-dependencies */
import TypeMachine from 'migration-script/modules/machines/typeorm/entities/type-machine';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TypeAddress from './type-address';

@Entity('selling_point')
class TypeSellingPoint {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'address_id' })
  addressId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column()
  name: string;

  @Column()
  responsible: string;

  @Column()
  phone1: string;

  @Column()
  phone2: string;

  @OneToMany(() => TypeMachine, machine => machine.sellingPoint)
  machines: TypeMachine[];

  @OneToOne(() => TypeAddress, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'address_id' })
  address: TypeAddress;
}

export default TypeSellingPoint;
